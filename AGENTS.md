# AGENTS.md

KidGames is a Vite + React + TypeScript single-page app. Game logic lives in
`src/games/` as pure functions (unit tested), and React components in
`src/components/` render them. See `README.md` for the full script list.

## Cursor Cloud specific instructions

- Dependencies are installed automatically on startup (`npm install`). No
  system packages or services are required.
- Standard commands are defined in `package.json` scripts: `npm run dev`
  (dev server), `npm run build`, `npm run lint`, `npm test`.
- The dev server (`npm run dev`) is configured with `host: true` on port
  `5173` (see `vite.config.ts`) so it is reachable from outside the VM. It is
  a long-running process — start it in a background/tmux session, not a
  blocking foreground shell.
- Tests use Vitest with the `jsdom` environment; `npm test` runs them once
  (non-watch). There is no separate database or backend to start.
