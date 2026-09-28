# toolbox

Toolbox is Sifr Studio's edge bench. A Hono app on Cloudflare Workers returns HTML. Tailwind and DaisyUI style the home page. One button uses HTMX to swap in a fragment from `GET /stack`.

## Run locally

```bash
npm install
npm run dev
```

Vite serves the app at http://127.0.0.1:4317. The Cloudflare Vite plugin runs the Worker in workerd.

```bash
npm run typecheck
npm run build
```

## Deploy and preview

Pull requests run `.github/workflows/pull-request.yml`. The job installs dependencies, typechecks, and builds. It then uploads a Workers Preview with `npx wrangler preview` (Wrangler 4.135 or newer) and comments the preview URL on the pull request. Closing the pull request deletes that preview.

Pushes to `main` run `.github/workflows/deploy.yml`, which typechecks, builds, and deploys with `npx wrangler deploy`.

Both workflows need the repository secrets `CLOUDFLARE_API_TOKEN` and `CLOUDFLARE_ACCOUNT_ID`. The token needs permission to edit this Worker.

When the GitHub repository is connected to Workers Builds, production builds on `main` run `npm run build` and then `npx wrangler deploy`. Other branches run `npx wrangler preview`. Workers Builds comments the preview URL on the pull request.
