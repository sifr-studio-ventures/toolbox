import type { User } from "./factory/db";

export type EmailBinding = {
  send: (message: unknown) => Promise<unknown>;
};

export type AppBindings = {
  DB: D1Database;
  ENVIRONMENT: string;
  RESEND_API_KEY?: string;
  EMAIL?: EmailBinding;
};

export type AppContext = {
  Bindings: AppBindings;
  Variables: {
    user: User | null;
  };
};
