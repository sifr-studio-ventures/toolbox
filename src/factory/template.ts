export const PUBLIC_SHARE_TOKEN = "building-opentoolbox";

export const VALUE_FACTORY_COLUMNS: { name: string; checks: string[] }[] = [
  {
    name: "Research",
    checks: ["Problem is written in one sentence", "Sources are linked", "Open questions are listed"],
  },
  {
    name: "Data",
    checks: ["Metric is named", "Source is identified", "Baseline number is recorded"],
  },
  {
    name: "Business",
    checks: ["Buyer is named", "Price hypothesis is written", "Cost to serve is noted"],
  },
  {
    name: "Product",
    checks: ["Job to be done is stated", "Scope for this slice is cut", "Success looks like a sentence"],
  },
  {
    name: "UI/UX",
    checks: ["Main flow is sketched", "Empty state has copy", "Mobile layout is considered"],
  },
  {
    name: "Engineer",
    checks: ["Approach is chosen", "Risk is listed", "Slice can ship"],
  },
  {
    name: "Market",
    checks: ["Audience is named", "Channel is picked", "Message is drafted"],
  },
  {
    name: "Sell",
    checks: ["Offer is written", "Objection is listed", "Next ask is set"],
  },
  {
    name: "GTM",
    checks: ["Launch moment is set", "Asset is ready", "Owner is named"],
  },
  {
    name: "Support",
    checks: ["Issue path is clear", "Reply owner is set", "Known gaps are listed"],
  },
  {
    name: "Done",
    checks: ["Shipped", "Shared with people who need it", "Result is measured"],
  },
];

export const NEW_COLUMN_CHECKS = ["Named", "Ready for the next column"];

export const SEEDED = {
  userId: "6d5a1c2e-4b8f-4e1a-9c3d-7f2a8b1c0d11",
  workspaceId: "1a2b3c4d-5e6f-4a7b-8c9d-0e1f2a3b4c5d",
  boardId: "9c8b7a6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d",
  email: "mohammadameerabdallah@gmail.com",
  workspaceName: "opentoolbox",
  boardName: "Building opentoolbox",
  createdAt: "2026-10-02T09:00:00.000Z",
};

export const SEEDED_COLUMN_IDS = [
  "c1000001-0000-4000-8000-000000000001",
  "c1000001-0000-4000-8000-000000000002",
  "c1000001-0000-4000-8000-000000000003",
  "c1000001-0000-4000-8000-000000000004",
  "c1000001-0000-4000-8000-000000000005",
  "c1000001-0000-4000-8000-000000000006",
  "c1000001-0000-4000-8000-000000000007",
  "c1000001-0000-4000-8000-000000000008",
  "c1000001-0000-4000-8000-000000000009",
  "c1000001-0000-4000-8000-00000000000a",
  "c1000001-0000-4000-8000-00000000000b",
];

export type SeedCard = {
  id: string;
  column: string;
  title: string;
  owner: string;
  value: number;
  notes: string;
  links: { label: string; url: string }[];
  done: number[];
};

export const SEEDED_CARDS: SeedCard[] = [
  {
    id: "a1000001-0000-4000-8000-000000000001",
    column: "Research",
    title: "Research notes",
    owner: "Mohammad",
    value: 6,
    notes:
      "Write down what a first visitor is trying to do. Keep the question, the source, and the assumption in the same place.",
    links: [{ label: "opentoolbox.io", url: "https://opentoolbox.io" }],
    done: [],
  },
  {
    id: "a1000001-0000-4000-8000-000000000002",
    column: "Data",
    title: "Simple metrics",
    owner: "Mohammad",
    value: 8,
    notes: "Count visits, sign-ins, and boards created. One weekly number is enough to see if people come back.",
    links: [],
    done: [],
  },
  {
    id: "a1000001-0000-4000-8000-000000000003",
    column: "Business",
    title: "Pricing sketch",
    owner: "",
    value: 5,
    notes: "Name who would pay, what they would pay for, and what stays free. The public board stays free.",
    links: [],
    done: [],
  },
  {
    id: "a1000001-0000-4000-8000-000000000004",
    column: "Product",
    title: "Public roadmap",
    owner: "Mohammad",
    value: 8,
    notes: "A page that says what is shipping next. This card tracks that page. It is not the page.",
    links: [],
    done: [],
  },
  {
    id: "a1000001-0000-4000-8000-000000000005",
    column: "UI/UX",
    title: "Homepage that explains the bench",
    owner: "",
    value: 6,
    notes: "A new person should see what Toolbox is, and how to open a board, on a phone and on a desk.",
    links: [{ label: "Home", url: "https://opentoolbox.io" }],
    done: [],
  },
  {
    id: "a1000001-0000-4000-8000-000000000006",
    column: "Engineer",
    title: "Collaborator sign-in",
    owner: "Mohammad",
    value: 9,
    notes: "Magic link only. No passwords. The first account is mohammadameerabdallah@gmail.com.",
    links: [],
    done: [],
  },
  {
    id: "a1000001-0000-4000-8000-000000000007",
    column: "Market",
    title: "Who the first users are",
    owner: "Mohammad",
    value: 7,
    notes: "We are the first users. Name the next three people who should try a board, and why they would return.",
    links: [],
    done: [],
  },
  {
    id: "a1000001-0000-4000-8000-000000000008",
    column: "Sell",
    title: "Launch note",
    owner: "",
    value: 7,
    notes: "A short note you can send: what the factory is, the public board link, and how to sign in.",
    links: [{ label: "Public board", url: "https://opentoolbox.io/b/building-opentoolbox" }],
    done: [],
  },
  {
    id: "a1000001-0000-4000-8000-000000000009",
    column: "GTM",
    title: "Changelog",
    owner: "",
    value: 7,
    notes: "When the factory ships, write what changed in plain language so people can see the product move.",
    links: [],
    done: [],
  },
  {
    id: "a1000001-0000-4000-8000-00000000000a",
    column: "Support",
    title: "Feedback form",
    owner: "Mohammad",
    value: 9,
    notes: "A place for a visitor to say what broke or what they wanted. Turn the useful notes into cards.",
    links: [],
    done: [],
  },
  {
    id: "a1000001-0000-4000-8000-00000000000b",
    column: "Done",
    title: "Edge bench is live",
    owner: "Mohammad",
    value: 10,
    notes: "opentoolbox.io serves the Worker. The other hosts redirect to the same path. This slice is shipped.",
    links: [{ label: "opentoolbox.io", url: "https://opentoolbox.io" }],
    done: [0, 1, 2],
  },
];
