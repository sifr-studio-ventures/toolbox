# Product analytics

Our pitch: *Usage and funnel signals so you grow what people actually use.* (Pro tier: "Analytics + bug reporting")

## Pricing

| Tool | Model | Free tier | Paid | Confidence |
| --- | --- | --- | --- | --- |
| **PostHog** | usage-based, per product | Monthly: **1M events**, **5K web + 2.5K mobile session replays**, **1M feature-flag requests**, **1,500 survey responses**, plus error tracking, data warehouse rows and AI credits. No card needed. | Events from **~$0.00005** each (anonymous; identified events are priced higher), replays **$0.005 → $0.0015**, flags ~$0.0001/request, surveys ~$0.10 → $0.01/response. Team/enterprise add-ons are extra. | official + 3rd-party |
| **Mixpanel** | event-based (since Feb 2025) | **1M events/mo**, unlimited seats | Growth: above 1M, about **$0.28 per 1,000 events** (slider up to 20M+) | 3rd-party, some conflict |
| **Amplitude** | MTU / events | ~**2M events** or 10K MTUs | Plus **$49/mo** (annual); Growth and Enterprise quote-only | 3rd-party |
| **Hotjar** (Contentsquare) | sessions | Free €0 | Growth **€39/mo**; Pro and Enterprise contact sales | 3rd-party (Formbricks blog) |

## Feature notes

- **PostHog** is the "product OS": analytics, session replay, feature flags, A/B testing, surveys, error tracking, a data warehouse and LLM analytics. It's developer-oriented and open source. It is our **biggest overlap**: analytics, surveys and (via replay and error tracking) bug context.
- **Mixpanel / Amplitude** have deep self-serve product analytics (funnels, retention, cohorts), aimed at PMs and growth teams.
- **Hotjar** offers heatmaps, recordings and feedback widgets. It's now part of Contentsquare and not sold on its own.

## Implications for Open Toolbox

- PostHog's free tier (1M events) means small teams pay $0 for analytics. We **cannot win on analytics price**, so we win on making analytics drive the other tools. For example: "users who hit this funnel drop-off" → trigger a popup or survey → answers become cards.
- Built on Cloudflare, we could use Workers Analytics Engine or D1 for event ingest at low cost. A first version should cover pageviews, custom events, funnels and retention.
- Usage-based pricing is the norm here. If we ever meter events, publish generous included quotas per seat.

## Sources

- [PostHog pricing (official)](https://posthog.com/pricing), [Session Replay pricing (official)](https://posthog.com/docs/session-replay/pricing), [Product analytics pricing (official)](https://posthog.com/docs/product-analytics/pricing)
- [PostHog pricing teardown — dev.to](https://dev.to/beton/posthog-pricing-teardown-2026-57oo), [rybbit.com](https://rybbit.com/blog/posthog-pricing), [userorbit.com](https://userorbit.com/blog/posthog-pricing-guide)
- [Amplitude vs Mixpanel vs PostHog pricing — userinsight.ai](https://userinsight.ai/amplitude-vs-mixpanel-vs-posthog-pricing), [Amplitude pricing — mitzu.io](https://mitzu.io/post/amplitude-pricing/), [Mixpanel tiers — comparetiers.com](https://comparetiers.com/tools/mixpanel)
- [Hotjar pricing 2026 — formbricks.com](https://formbricks.com/blog/hotjar-pricing)
