# Surveys

Our pitch: *Ask users what blocked them — and feed answers straight into the backlog.*

## Pricing

| Tool | Free | Entry paid | Mid tier | Top tier | Confidence |
| --- | --- | --- | --- | --- | --- |
| **PostHog Surveys** | **1,500 responses/mo** | ~$0.10/response, falling to ~$0.01 above 20K | — | — | official (free tier) + 3rd-party (rates) |
| **Formbricks** | Hobby: 1 workspace, **250 responses/mo**, full API; self-hosted Community Edition free | Pro **$74/mo** annual ($89 monthly), 2,000 responses | Scale **$325/mo** annual ($390 monthly), 5,000 responses | Enterprise | 3rd-party (Formbricks' own blog) |
| **Hotjar** (Contentsquare) | Free, ~100 survey responses/mo | Growth **€39/mo** | Pro / Enterprise contact sales | — | 3rd-party |
| **SurveyMonkey** | Basic free | Team Advantage **$30/user** (3-user min) | Team Premier **$92/user** (3-user min) | Individual plans unpublished | 3rd-party |
| **Featurebase** | Included in plans (see support-chat.md) | from $29/seat | — | — | official |
| **Typeform / Tally** | Forms doubling as surveys (see forms.md) | — | — | — | — |

## Feature notes

- **In-product surveys** (PostHog, Formbricks, Hotjar, Featurebase) are shown in the app and target users by behaviour. This is what product teams want: NPS, CSAT, "why did you cancel", feature validation.
- **SurveyMonkey** is classic research surveys (panels, email distribution) and less relevant to us.

## Implications for Open Toolbox

- Price anchor: Formbricks Pro at $74/month for 2,000 responses. PostHog gives 1,500 a month free.
- Our hook is already in the copy: **answers feed the backlog**. Ship survey → card linking, and NPS trends next to analytics.
- Delivery reuses popups (in-app modal) and forms (question blocks). It's one engine for three features, which makes it cheap to build.

## Sources

- [PostHog pricing (official)](https://posthog.com/pricing), [PostHog pricing — rybbit.com](https://rybbit.com/blog/posthog-pricing)
- [SurveyMonkey pricing 2026 — formbricks.com](https://formbricks.com/blog/surveymonkey-pricing), [Hotjar pricing 2026 — formbricks.com](https://formbricks.com/blog/hotjar-pricing), [Hotjar pricing — uxtweak.com](https://blog.uxtweak.com/hotjar-pricing/), [Formbricks review — europeanpurpose.com](https://europeanpurpose.com/tool/formbricks)
