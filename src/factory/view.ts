import { escapeHtml } from "../html";
import type { BoardView, CardView, ColumnView, WorkspaceBoard } from "./db";
import type { DeliveryRow, WebhookRow } from "../webhooks";

export type FactoryUser = { email: string } | null;

export function shell(user: FactoryUser, main: string): string {
  const account = user
    ? `<div class="flex items-center gap-2">
        <span class="hidden max-w-40 truncate text-sm sm:inline">${escapeHtml(user.email)}</span>
        <form method="post" action="/signout"><button class="btn btn-ghost btn-sm">Sign out</button></form>
      </div>`
    : `<a class="btn btn-primary btn-sm" href="/signin">Sign in</a>`;

  return `<div class="drawer">
    <input id="nav-drawer" type="checkbox" class="drawer-toggle" />
    <div class="drawer-content flex min-h-screen flex-col">
      <header class="navbar border-b border-base-300 bg-base-100 px-4 md:px-8">
        <div class="navbar-start gap-2">
          <label for="nav-drawer" class="btn btn-ghost btn-square lg:hidden" aria-label="Open menu">
            <svg xmlns="http://www.w3.org/2000/svg" class="size-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 7h16M4 12h16M4 17h16" />
            </svg>
          </label>
          <a class="text-lg font-semibold tracking-tight" href="/">Toolbox</a>
        </div>
        <nav class="navbar-center hidden gap-6 text-sm lg:flex">
          <a href="/factory" class="link link-hover">Value Factory</a>
          <a href="/b/building-opentoolbox" class="link link-hover">Public board</a>
        </nav>
        <div class="navbar-end">${account}</div>
      </header>
      <main class="mx-auto flex w-full max-w-6xl flex-1 flex-col gap-6 px-4 py-8 md:px-8">${main}</main>
      <footer class="border-t border-base-300 px-4 py-6 text-sm text-base-content/70 md:px-8">
        Value Factory \u00b7 Toolbox \u00b7 a board anyone can open
      </footer>
    </div>
    <div class="drawer-side z-20">
      <label for="nav-drawer" class="drawer-overlay" aria-label="Close menu"></label>
      <ul class="menu min-h-full w-72 bg-base-100 p-4 text-base">
        <li><a href="/factory">Value Factory</a></li>
        <li><a href="/b/building-opentoolbox">Building opentoolbox</a></li>
        <li><a href="/">Bench</a></li>
      </ul>
    </div>
  </div>`;
}
