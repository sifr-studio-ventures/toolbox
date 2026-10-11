# Open Toolbox — our features

Source: this repo (`src/page.ts`, `src/dashboard.ts`, `README.md`), October 2026.

## Positioning (as written on the site)

> All the tools you need to grow your product. Docs, canvas, kanban, CRM, chat, analytics, forms, popups, surveys, and bug reporting — in one toolkit.
>
> Built for teams who refuse to glue ten apps together.

Open Toolbox runs on Cloudflare Workers with Hono, D1, HTMX and Tailwind + DaisyUI.

## Feature inventory

| # | Feature | Pitch on the home page | Status in code | Primary competitors |
| --- | --- | --- | --- | --- |
| 1 | **Kanban** (hero tile) | Ship from research to done on a shared board — columns, cards, and status in one place. | Dashboard stub, "Coming soon". The old Value Factory board tables are still in D1 but unused. | Linear, Jira, Trello, Asana, ClickUp |
| 2 | **Docs** | Specs, PRDs, and launch notes next to the work — plus the live design system. | Dashboard stub, "Coming soon". The public `/design-system` page is live. | Notion, Confluence, Coda, ClickUp Docs |
| 3 | **Canvas** | Map journeys, flows, and product bets on a shared visual surface. | Dashboard stub, "Coming soon" | Miro, FigJam, Whimsical |
| 4 | **CRM** | Keep accounts, contacts, and pipeline context beside product decisions. | Marketing only | HubSpot, Attio, Pipedrive, folk |
| 5 | **Chat** | Customer support chat — tickets and conversations tied to accounts. | Marketing only | Intercom, Zendesk, Help Scout, Crisp |
| 6 | **Analytics** | Usage and funnel signals so you grow what people actually use. | Marketing only | PostHog, Mixpanel, Amplitude |
| 7 | **Forms** | Capture intake, waitlists, and requests without a separate form stack. | Marketing only | Tally, Typeform, Jotform |
| 8 | **Popups** | On-site prompts for announcements, upgrades, and guided moments. | Marketing only | OptinMonster, Poptin; in-app: Userpilot, Appcues, Chameleon |
| 9 | **Surveys** | Ask users what blocked them — and feed answers straight into the backlog. | Marketing only | PostHog Surveys, Formbricks, Hotjar, SurveyMonkey |
| 10 | **Bug reporting** | Collect repros and severity so triage lands on the board, not in chat scrollback. | Marketing only | Jam, Marker.io, BugHerd |

Platform features that already ship:
- Magic-link sign-in, with no passwords
- Organizations: list, switch, create, and a personal org created on first sign-in
- Dashboard shell with a tool sidebar
- Edge hosting on Cloudflare, with preview deploys per pull request

## Our pricing (from the home page)

| Plan | Price | Note | Includes |
| --- | --- | --- | --- |
| Free | $0 | Forever for getting started | Magic-link sign in, organizations & dashboard, public toolkit updates, design system on the edge |
| Pro *(featured, "Most useful next")* | $19 per seat / month | Coming soon | Private organizations; Docs, canvas, forms, surveys; analytics + bug reporting; popups |
| Team | $49 per seat / month | Coming soon | Everything in Pro; shared CRM + support chat; roles & shared orgs; priority toolkit updates |

The page says "No fake checkout": paid tiers aren't purchasable yet.

## The cross-tool links that make the bundle worth it

These are promised in our own copy, and no single competitor offers them:
- Survey answers go **straight into the backlog** (Surveys → Kanban).
- Bug repros and severity **land on the board** (Bug reporting → Kanban).
- Support tickets are **tied to accounts** (Chat → CRM).
- CRM context sits **beside product decisions** (CRM → Docs/Kanban).
- Popups and analytics close the loop: ship, prompt, measure.
