# toolbox

Toolbox is the Open Toolbox edge bench. A Hono app on Cloudflare Workers returns HTML. Tailwind and DaisyUI style the home page with the Coolors `toolbox` theme (Active `#023047`). One button uses HTMX to swap in a fragment from `GET /stack`. The public design system lives at `/design-system`.

## Run locally

```bash
npm install
npm run dev
```

Vite serves the app at http://127.0.0.1:4317. Open http://127.0.0.1:4317/design-system for Coolors swatches, Active `#023047`, type, spacing, radii, and the DaisyUI pieces the app already uses. The Cloudflare Vite plugin runs the Worker in workerd and keeps a local D1 database under `.wrangler`.

```bash
npm run typecheck
npm run build
```

## D1

Production uses the D1 database `toolbox` (`de4e9e60-7edd-43c8-9b73-80ab57e5d3c8`). Previews use `toolbox-preview` (`75a5b54d-7100-4d96-9e55-dc69facf917d`). Both are bound as `DB` in `wrangler.jsonc`. SQL files live in `migrations/`.

The Worker applies any migration that is not already recorded in `d1_migrations`, then seeds the public board "Building opentoolbox" if that board is not there yet. That means a Workers Builds deploy picks up schema changes on the first request. CI also applies migrations before `wrangler deploy` and `wrangler preview`.

Local only:

```bash
npm run db:migrate:local
```

Remote production and preview:

```bash
npm run db:migrate
npm run db:migrate:preview
```

## Magic links

Sign-in is email only. There is no password. Local dev (`localhost` or `127.0.0.1`) and preview (`ENVIRONMENT=preview`) show the sign-in link on the page, so you can sign in when email is not configured. Production sends through the Cloudflare Email binding when that send succeeds. If `RESEND_API_KEY` is set as a Worker secret, Resend is the fallback. Production without a working sender tells you that no email was sent. It does not pretend the message went out, and it does not print the link.

## Deploy and preview

Pull requests run `.github/workflows/pull-request.yml`. The job installs dependencies, typechecks, and builds. It then uploads a Workers Preview with `npx wrangler preview` (Wrangler 4.135 or newer) and comments the preview URL on the pull request. Closing the pull request deletes that preview.

Pushes to `main` run `.github/workflows/deploy.yml`, which typechecks, builds, and deploys with `npx wrangler deploy`.

Both workflows need the repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The token needs permission to edit this Worker.

When the GitHub repository is connected to Workers Builds, production builds on `main` run `npm run build` and then `npx wrangler deploy`. Other branches run `npx wrangler preview`. Workers Builds comments the preview URL on the pull request. The Worker applies `migrations/` on the first request of that deploy, so the preview database does not depend on the dashboard deploy command also running `wrangler d1 migrations apply`.
