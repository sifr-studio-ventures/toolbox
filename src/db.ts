export type User = { id: string; email: string };

export type Org = { id: string; name: string; created_at: string };

export type OrgMembership = Org & { role: string };

const ACTIVE_ORG_COOKIE = "ot_org";

export function readActiveOrgId(cookieHeader: string): string | null {
  for (const part of cookieHeader.split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key === ACTIVE_ORG_COOKIE) {
      const value = decodeURIComponent(rest.join("="));
      return value || null;
    }
  }
  return null;
}

export function activeOrgCookie(orgId: string, secure: boolean): string {
  const secureFlag = secure ? "; Secure" : "";
  return `${ACTIVE_ORG_COOKIE}=${encodeURIComponent(orgId)}; Path=/; SameSite=Lax; Max-Age=${60 * 60 * 24 * 365}${secureFlag}`;
}

export function clearActiveOrgCookie(secure: boolean): string {
  const secureFlag = secure ? "; Secure" : "";
  return `${ACTIVE_ORG_COOKIE}=; Path=/; SameSite=Lax; Max-Age=0${secureFlag}`;
}

export async function listOrgsForUser(db: D1Database, userId: string): Promise<OrgMembership[]> {
  const rows = await db
    .prepare(
      `SELECT o.id, o.name, o.created_at, m.role
       FROM org_members m
       JOIN orgs o ON o.id = m.org_id
       WHERE m.user_id = ?
       ORDER BY o.created_at, o.name`,
    )
    .bind(userId)
    .all<OrgMembership>();
  return rows.results ?? [];
}

export async function orgForMember(
  db: D1Database,
  userId: string,
  orgId: string,
): Promise<OrgMembership | null> {
  return db
    .prepare(
      `SELECT o.id, o.name, o.created_at, m.role
       FROM org_members m
       JOIN orgs o ON o.id = m.org_id
       WHERE m.user_id = ? AND o.id = ?`,
    )
    .bind(userId, orgId)
    .first<OrgMembership>();
}

export async function createOrg(db: D1Database, userId: string, name: string): Promise<string> {
  const id = crypto.randomUUID();
  const now = new Date().toISOString();
  await db.batch([
    db.prepare("INSERT INTO orgs (id, name, created_at) VALUES (?, ?, ?)").bind(id, name, now),
    db
      .prepare("INSERT INTO org_members (org_id, user_id, role, created_at) VALUES (?, ?, 'owner', ?)")
      .bind(id, userId, now),
  ]);
  return id;
}

function personalOrgName(email: string): string {
  const local = email.split("@")[0]?.trim() || "Personal";
  const label = local.length > 40 ? `${local.slice(0, 37)}...` : local;
  return `${label}'s org`;
}

/** Ensure the user has at least one org; create a personal org on first visit. */
export async function ensureUserOrgs(db: D1Database, user: User): Promise<OrgMembership[]> {
  let orgs = await listOrgsForUser(db, user.id);
  if (orgs.length > 0) return orgs;
  await createOrg(db, user.id, personalOrgName(user.email));
  orgs = await listOrgsForUser(db, user.id);
  return orgs;
}

export async function resolveActiveOrg(
  db: D1Database,
  user: User,
  cookieHeader: string,
): Promise<{ orgs: OrgMembership[]; active: OrgMembership }> {
  const orgs = await ensureUserOrgs(db, user);
  const preferred = readActiveOrgId(cookieHeader);
  const active =
    (preferred ? orgs.find((org) => org.id === preferred) : undefined) ?? orgs[0];
  if (!active) {
    throw new Error("org-missing");
  }
  return { orgs, active };
}
