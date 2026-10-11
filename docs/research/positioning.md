# Positioning, gaps and recommendations

Based on the research in this folder (October 2026).

## Where Open Toolbox sits

```
            Internal work                     Customer signal
   (plan, write, map — the team)       (measure, ask, support — the users)
 ┌──────────────────────────────┐   ┌──────────────────────────────────────┐
 │ Linear · Jira · Trello       │   │ PostHog · Mixpanel · Amplitude        │
 │ Notion · Confluence          │   │ Intercom · Zendesk · Crisp            │
 │ Miro · FigJam · Whimsical    │   │ Tally · Typeform · Formbricks         │
 │ ClickUp · monday (suites)    │   │ Userpilot · Appcues · Jam · Marker.io │
 │                              │   │ Featurebase · HubSpot (suites)        │
 └──────────────┬───────────────┘   └───────────────────┬──────────────────┘
                └──────────── Open Toolbox ──────────────┘
                  one org, one login, signal → backlog
```

Suites cover one side or the other. Open Toolbox's claim is to **join them**: customer signal (surveys, bugs, tickets, analytics, form submissions) flows straight onto the board and into docs and CRM.

## Our strengths

- **Price** for teams of 10+: $49/seat for everything beats both assembled stacks (see [pricing-comparison.md](pricing-comparison.md)).
- **In-app popups at Pro ($19)** replace a $250–300/month onboarding tool. It's our single biggest saving.
- **No usage fees (today)**, in a market moving to AI-resolution and per-event billing.
- **Edge-native on Cloudflare**, so it's fast everywhere and cheap to run, which keeps flat pricing sustainable.
- **Honest brand voice** ("No fake checkout"), which stands out against promotional intro pricing like OptinMonster's or Intercom's.

## Gaps and risks

1. **Nothing is built yet beyond auth, orgs and the dashboard.** Docs, Canvas and Kanban are "Coming soon" and the other seven are marketing copy. Every competitor here ships a mature product.
2. **Depth against specialists.** Linear, Notion, Miro and Tally set high bars, and a bundle that is weaker at everything doesn't sell.
3. **Small teams can stay free.** PostHog, Tally, Linear, Trello, Miro and Jam all have usable free tiers.
4. **Pro's feature list leaves out Kanban**, the hero feature on the home page.
5. **AI is absent.** ClickUp, Notion, Linear, Intercom, Attio, Featurebase and Jam all market AI. It's expected now, even if it isn't the reason people buy.
6. **Per-seat-for-everything pricing** penalises large teams where few people need CRM or support.

## Recommendations

### Build order: ship the loop, not ten tools

1. **Kanban** (hero; the place everything else lands)
2. **Forms** → cards and contacts (cheap to build; reuses the design system's fields)
3. **Bug reporting widget** → cards with severity (strong developer pull; Jam's free tier proves the demand)
4. **Surveys + in-app popups**, one engine sharing the modal and form blocks (replaces $74 + $249/month tools)
5. **Analytics** (events, funnels), which then targets popups and surveys
6. **Docs** linked to cards
7. **CRM + support chat** (Team tier)
8. **Canvas** (journey maps and flows, scoped like Whimsical, not Miro)

Steps 1–5 already make the "customer signal → backlog" story real and cover Pro.

### Pricing

- Add **Kanban** to the Pro feature list.
- Make **Free** genuinely useful: one board, unlimited forms (to match Tally), limited survey responses and bug reports. That keeps PostHog-, Tally- and Linear-free teams from never upgrading.
- Offer **free viewer/guest seats** (Jam, Coda and Miro set the precedent) so stakeholders don't count toward per-seat cost.
- Decide on AI now: either **include an AI quota per seat** (supports "no usage surprises") or meter it below Featurebase's $0.49 and Intercom's $0.99 per resolution.
- Consider a **startup programme**, since Linear gives startups Business for free and Intercom discounts its first year.

### Messaging

- Lead with the loop: *"Bugs, survey answers and tickets land on your board — no Zapier."*
- Use the cost math: *"Ten tools, one bill: $49/seat instead of ~$1,700/month across ten vendors."* Re-verify the numbers before publishing.
- Name the in-app popup saving explicitly: it's the largest and least known.

## Watch list

| Competitor | Why | Signal to watch |
| --- | --- | --- |
| PostHog | Closest on analytics, surveys and bug context; very fast product velocity | Any move into boards, roadmaps or feedback-to-issue |
| Featurebase | Same "feedback → roadmap → support" loop at $29/seat | Adding kanban or CRM; AI fee changes |
| ClickUp | Broadest "replace everything" brand | Customer-facing features (forms → support) |
| Notion | Startup default for docs | Notion Forms + Custom Agents expanding into intake and triage |
| Linear | Product teams' favourite board | Customer Requests, Asks and intake features |
