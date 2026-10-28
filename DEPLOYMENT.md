# Railway deployment

The live service uses the public GitHub source `Crybik/badminton-club-proposal`, branch `main`, with automatic deployments for source changes.

Configure these values in the Railway service settings:

| Setting | Value |
| --- | --- |
| Builder | Railpack |
| Root directory | Repository root |
| Build command | `npm run build` |
| Start command | `npm start` |
| Health-check path | `/health` |
| Health-check timeout | 120 seconds |
| Restart policy | On failure |
| Maximum restart attempts | 3 |

Generate a Railway service domain. The application listens on the injected `PORT` at `0.0.0.0`; no database, application secrets or other services are needed.

The legacy `railway.json` / `railway.toml` configuration format was rejected as deprecated by Railway during this deployment. Service settings are configured directly. If infrastructure as code is desired later, use Railway's current supported format rather than restoring the deprecated file.

## Verify a release

1. Confirm the local commit matches the `main` commit pushed to GitHub.
2. Inspect Railway's active deployment status and its `commitHash`; require `SUCCESS` at that SHA.
3. Request the public `/health` endpoint; require HTTP 200 and the same `commit` value.
4. Confirm `/release.json` and the deployed assets match the build.
5. Run browser checks with `BASE_URL` set to the public origin. Tests are non-destructive; the method-boundary check sends a POST to the static root and expects 405.

The proposal's role previews are illustrative interfaces. They do not create accounts, bookings, payments or customer messages.
