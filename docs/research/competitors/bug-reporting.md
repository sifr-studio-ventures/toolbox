# Bug reporting

Our pitch: *Collect repros and severity so triage lands on the board, not in chat scrollback.* (Pro tier)

## Pricing (USD, annual billing)

| Tool | Free | Entry paid | Higher tier | Confidence |
| --- | --- | --- | --- | --- |
| **Jam** | Free: 30 Jams, 5 recording links, ≤5-min recordings; console + network logs included | Team **$14 / creator / month** (unlimited Jams, free viewer seats, 14-day trial) | Enterprise custom | official |
| **Marker.io** | — (trial) | Starter **~$39/mo** (3 users; $59 monthly) | Team **~$149/mo** (15 users), console + network capture; other sources cite $79 / $199 | 3rd-party, conflicting |
| **BugHerd** | — (trial) | Standard **~$39–50/mo** (5 members, +$8/seat) | Premium needed for Jira/Linear integrations | 3rd-party, conflicting |

## Feature notes

- **Jam** is a browser extension that records the screen and captures console, network, device info and repro steps into one link. It's developer-loved, with Linear/Jira/Slack integrations, AI summaries and MCP support.
- **Marker.io** is website feedback widgets for clients and QA, which sync to Jira, Linear and others.
- **BugHerd** is visual "sticky note on the page" feedback for agencies and clients.
- **PostHog** (session replay + error tracking) is an indirect competitor: replays often stand in for repros.

## Implications for Open Toolbox

- Jam's free tier and $14/creator is the anchor. Free viewer seats are the norm.
- **Our differentiator is that bugs arrive as a card on our own board, with severity**, so no Linear/Jira integration is needed. Competitors gate tracker integrations behind higher tiers.
- v1: an embeddable widget (screenshot, console and network logs, browser/device, steps), creating a card with a severity label, linked to the reporter's CRM account when they're a customer.

## Sources

- [Jam pricing (official)](https://jam.dev/pricing), [Jam members & roles (official)](https://jam.dev/docs/members-and-roles)
- [Best bug reporting tools 2026 — crosscheck.cloud](https://crosscheck.cloud/blogs/best-bug-reporting-tools-2026/), [Marker.io alternatives — faster-fixes.com](https://www.faster-fixes.com/blog/marker-io-alternatives), [Jam alternatives — clipy.online](https://clipy.online/blogs/jam-dev-alternatives/#jam-vs-clipy), [bugreel.io](https://bugreel.io/blog/jam-dev-alternative-open-source), [Jam review — makerstack.co](https://makerstack.co/reviews/jam-dev-review/)
- [Marker.io pricing — G2](https://g2.com/products/marker-io/pricing), [Bug report MCP servers — marklayer.app](https://marklayer.app/guides/bug-report-mcp-servers)
