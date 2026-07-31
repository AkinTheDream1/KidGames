# KidGames 🎮

A collection of simple, colorful browser games for kids, built with
**Vite + React + TypeScript**.

Included games:

- 🧠 **Memory Match** — flip cards and find matching animal pairs.
- ➕ **Math Quiz** — practice addition and subtraction.

## Getting started

Requires Node.js 18+ (developed on Node 22).

```bash
npm install       # install dependencies
npm run dev       # start the dev server at http://localhost:5173
```

## Scripts

| Command          | Description                                  |
| ---------------- | -------------------------------------------- |
| `npm run dev`    | Start the Vite dev server (hot reload).      |
| `npm run build`  | Type-check and build for production.         |
| `npm run preview`| Preview the production build locally.        |
| `npm run lint`   | Run ESLint over the project.                 |
| `npm test`       | Run the Vitest test suite once.              |
| `npm run test:watch` | Run tests in watch mode.                 |

## Project structure

```
src/
  App.tsx              # game menu + navigation
  components/          # React components for each game
  games/               # pure, unit-tested game logic
  test/setup.ts        # Vitest + jest-dom setup
```

Game logic lives in `src/games/` as pure functions so it can be unit tested
independently of the UI.
