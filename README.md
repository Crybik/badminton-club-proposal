# Badminton club app — revised proposal

A complete bilingual proposal website for a focused club-management app. Custom court illustrations, interactive player/coach/admin previews, clear scope disclosures, milestone timeline, pricing, expandable details and a print layout. English and Arabic with RTL support.

The interface previews use illustrative data. This repository contains the proposal website, not the club application.

## Run

Requires Node.js 24.

```sh
npm ci
npm run build
npm start
```

Open http://localhost:3000. The server respects `PORT` and listens on `0.0.0.0` for Railway. No database, secrets, paid API or runtime npm dependency is required.

## Edit

- `src/content.js`: both languages and shared commercial amounts.
- `src/view.js`: pre-renderable page and illustrative interface components.
- `src/styles.css`: responsive, RTL, reduced-motion and print styles.
- `src/app.js`: language preference, accessible tabs, mobile navigation and printing.
- `scripts/build.mjs`: static build and release metadata.
- `server.mjs`: static serving and `/health` release identity.

The draft offer is 2,500 JD, split 1,300/1,200. It includes a capped 300 JD startup-cost budget, a defined 60-day defect warranty and optional 100 JD/month maintenance up to two hours. The page states the revised scope and exclusions; final commercial/legal agreement remains separate.

## Checks

```sh
npm test
```

Tests use installed Google Chrome through Playwright. They cover English/Arabic at 320, 390, 768 and 1440px, navigation, keyboard tabs, language persistence, scope/pricing, overflow, expanded terms, axe accessibility, print visibility, health and private-file boundaries. Set `BASE_URL` to test an already deployed instance.

## Deploy

`railway.json` uses Railpack, runs `npm run build`, starts `npm start`, and checks `/health`. Connect the public repository's `main` branch to Railway and generate a service domain. `/health` returns the active Git commit when Railway provides `RAILWAY_GIT_COMMIT_SHA`; `/release.json` records build metadata.

No credentials or local review/consultation materials are included in this repository.
