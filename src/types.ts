import type { User } from "./db";

export type EmailBinding = {
  send: (message: unknown) => Promise<unknown>;
};

export type AppBindings = {
  DB: D1Database;
  ENVIRONMENT: string;
  RESEND_API_KEY?: string;
  EMAIL?: EmailBinding;
  ASSETS?: Fetcher;
};

export type AppContext = {
  Bindings: AppBindings;
  Variables: {
    user: User | null;
  };
};
