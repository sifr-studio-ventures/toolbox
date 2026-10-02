
  app.post("/boards/:boardId/cards/:cardId", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const form = await c.req.formData();
    const parsed = parseCardForm(form);
    if ("error" in parsed) {
      const board = await loadBoard(c.env.DB, access.board);
      const existing = findCard(board.columns, c.req.param("cardId"));
      if (!existing) return columnsResponse(c, access.board, "That card is gone.");
      const draft: CardView = {
        ...existing,
        title: String(form.get("title") ?? existing.title),
        owner_label: String(form.get("owner") ?? ""),
        notes: String(form.get("notes") ?? ""),
        value_score: existing.value_score,
      };
      if (isHtmx(c)) {
        c.header("HX-Retarget", "#card-dialog-body");
        c.header("HX-Reswap", "innerHTML");
        return c.html(cardForm(access.board.id, draft, parsed.error), 400);
      }
      return columnsResponse(c, access.board, parsed.error);
    }
    const updated = await updateCard(c.env.DB, access.board.id, c.req.param("cardId"), parsed.value);
    if (!updated) return columnsResponse(c, access.board, "That card is gone.");
    const name = (await columnName(c.env.DB, updated.column_id)) ?? "";
    queueWebhooks(c, access.board.id, "card.edited", {
      board_name: access.board.name,
      card: cardPayload(updated, name),
    });
    if (isHtmx(c)) c.header("HX-Trigger", JSON.stringify({ closeCard: true }));
    return columnsResponse(c, access.board, null);
  });

  app.post("/boards/:boardId/cards/:cardId/move", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const form = await c.req.formData();
    const columnId = String(form.get("column_id") ?? "");
    const moved = await moveCard(c.env.DB, access.board.id, c.req.param("cardId"), columnId);
    if (!moved) return columnsResponse(c, access.board, "Pick a column on this board.");
    if (moved.fromColumnId !== moved.card.column_id) {
      const [fromName, toName] = await Promise.all([
        columnName(c.env.DB, moved.fromColumnId),
        columnName(c.env.DB, moved.card.column_id),
      ]);
      queueWebhooks(c, access.board.id, "card.moved", {
        board_name: access.board.name,
        from_column: { id: moved.fromColumnId, name: fromName },
        to_column: { id: moved.card.column_id, name: toName },
        card: cardPayload(moved.card, toName ?? ""),
      });
    }
    return columnsResponse(c, access.board, null);
  });

  app.post("/boards/:boardId/cards/:cardId/checks", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const form = await c.req.formData();
    const columnId = String(form.get("column_id") ?? "");
    const itemIndex = Number(form.get("item_index") ?? "");
    const done = form.getAll("done").includes("1");
    if (!Number.isInteger(itemIndex) || itemIndex < 0) return columnsResponse(c, access.board, "That checklist item is missing.");
    const ok = await setCheck(c.env.DB, access.board.id, c.req.param("cardId"), columnId, itemIndex, done);
    if (!ok) return columnsResponse(c, access.board, "That card is not in this column.");
    return columnsResponse(c, access.board, null);
  });

  app.delete("/boards/:boardId/cards/:cardId", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const card = await deleteCard(c.env.DB, access.board.id, c.req.param("cardId"));
    if (!card) return columnsResponse(c, access.board, "That card is already gone.");
    const name = (await columnName(c.env.DB, card.column_id)) ?? "";
    queueWebhooks(c, access.board.id, "card.deleted", {
      board_name: access.board.name,
      card: cardPayload(card, name),
    });
    return columnsResponse(c, access.board, null);
  });

  app.post("/boards/:boardId/webhooks", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const form = await c.req.formData();
    const url = safeWebhookUrl(String(form.get("url") ?? ""));
    if (!url) return hooksResponse(c, access.board.id, "Use an https URL that is not a private address.");
    const now = new Date().toISOString();
    await c.env.DB.prepare("INSERT INTO webhooks (id, board_id, url, secret, created_at) VALUES (?, ?, ?, ?, ?)")
      .bind(crypto.randomUUID(), access.board.id, url, newWebhookSecret(), now)
      .run();
    return hooksResponse(c, access.board.id, null);
  });

  app.delete("/boards/:boardId/webhooks/:webhookId", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    await c.env.DB.prepare("DELETE FROM webhooks WHERE id = ? AND board_id = ?")
      .bind(c.req.param("webhookId"), access.board.id)
      .run();
    return hooksResponse(c, access.board.id, null);
  });

  app.post("/boards/:boardId/deliveries/:deliveryId/resend", async (c) => {
    const access = await editableBoard(c);
    if (access instanceof Response) return access;
    const error = await resendDelivery(c.env.DB, access.board.id, c.req.param("deliveryId"));
    return hooksResponse(c, access.board.id, error);
  });
}

type Layout = (
  css: string,
  body: string,
  options?: { title?: string; description?: string },
) => string;

async function renderBoard(
  c: Context<AppContext>,
  css: string,
  layout: Layout,
  board: BoardRecord,
  mode: "edit" | "read",
  canEdit: boolean,
): Promise<Response> {
  const view = await loadBoard(c.env.DB, board);
  const origin = new URL(c.req.url).origin;
  const [webhooks, deliveries] = mode === "edit" ? await hookData(c.env.DB, board.id) : [[], []];
  c.header("Cache-Control", "no-store");
  return c.html(
    layout(
      css,
      shell(
        c.get("user"),
        boardPage({ board: view, mode, origin, canEdit, webhooks, deliveries, webhookError: null }),
      ),
      { title: `${board.name} · Value Factory`, description: `${board.name} on the Value Factory.` },
    ),
  );
}

async function columnsResponse(c: Context<AppContext>, board: BoardRecord, alert: string | null): Promise<Response> {
  if (!isHtmx(c)) return c.redirect(`/boards/${board.id}`);
  const view = await loadBoard(c.env.DB, board);
  return c.html(boardColumns(view, "edit", alert, true), alert ? 400 : 200);
}

async function hooksResponse(c: Context<AppContext>, boardId: string, error: string | null): Promise<Response> {
  if (!isHtmx(c)) return c.redirect(`/boards/${boardId}`);
  const [webhooks, deliveries] = await hookData(c.env.DB, boardId);
  return c.html(webhookPanel(boardId, webhooks, deliveries, error), error ? 400 : 200);
}

async function hookData(db: D1Database, boardId: string): Promise<[WebhookRow[], DeliveryRow[]]> {
  const [hooks, deliveries] = await Promise.all([
    db
      .prepare("SELECT id, board_id, url, secret, created_at FROM webhooks WHERE board_id = ? ORDER BY created_at")
      .bind(boardId)
      .all<WebhookRow>(),
    db
      .prepare(
        "SELECT id, webhook_id, board_id, event, payload_json, status_code, ok, error, created_at FROM webhook_deliveries WHERE board_id = ? ORDER BY created_at DESC LIMIT 20",
      )
      .bind(boardId)
      .all<DeliveryRow>(),
  ]);
  return [hooks.results ?? [], deliveries.results ?? []];
}

async function editableBoard(c: Context<AppContext>): Promise<{ user: User; board: BoardRecord } | Response> {
  const user = requireUser(c);
  if (user instanceof Response) return user;
  const boardId = c.req.param("boardId");
  if (!boardId) return c.redirect("/factory");
  const board = await memberBoard(c.env.DB, user.id, boardId);
  if (!board) {
    if (isHtmx(c)) return c.html(`<div class="alert alert-error"><span>That board is not yours.</span></div>`, 404);
    return c.redirect("/factory");
  }
  return { user, board };
}

function findCard(columns: { cards: CardView[] }[], cardId: string): CardView | null {
  for (const column of columns) {
    const card = column.cards.find((item) => item.id === cardId);
    if (card) return card;
  }
  return null;
}

function parseCardForm(form: FormData): { error: string } | { value: { title: string; owner: string; value: number; notes: string; links: { label: string; url: string }[] } } {
  const title = cleanName(String(form.get("title") ?? ""), 140);
  if (!title) return { error: "Give the card a title, up to 140 characters." };
  const owner = String(form.get("owner") ?? "").trim();
  if (owner.length > 80) return { error: "Owner is too long." };
  const notes = String(form.get("notes") ?? "").trim();
  if (notes.length > 4000) return { error: "Notes are too long." };
  const rawScore = String(form.get("value_score") ?? "0").trim();
  if (!/^\d+$/.test(rawScore)) return { error: "Value score is a whole number from 0 to 10." };
  const value = Number(rawScore);
  if (value > 10) return { error: "Value score is a whole number from 0 to 10." };
  const links = linksFromText(String(form.get("links") ?? ""));
  if (links.error) return { error: links.error };
  return { value: { title, owner, value, notes, links: links.links } };
}

function cleanName(value: string, max: number): string | null {
  const name = value.trim();
  if (!name || name.length > max) return null;
  return name;
}

async function factoryError(
  c: Context<AppContext>,
  css: string,
  layout: Layout,
  user: User,
  error: string,
): Promise<Response> {
  const rows = await listWorkspaceBoards(c.env.DB, user.id);
  return c.html(
    layout(css, shell(user, factoryHome(rows, error)), { title: "Value Factory · Open Toolbox" }),
    400,
  );
}

function missing(c: Context<AppContext>, css: string, layout: Layout, user: User | null): Response {
  return c.html(
    layout(
      css,
      shell(
        user,
        `<section class="mx-auto max-w-lg"><h1 class="text-2xl font-extrabold">That board is not here</h1><p class="mt-3">The link may be old, or the board was removed.</p><a class="btn btn-primary mt-4" href="/factory">Back to Value Factory</a></section>`,
      ),
      { title: "Board not found · Open Toolbox" },
    ),
    404,
  );
}
