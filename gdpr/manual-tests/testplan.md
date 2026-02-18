# Manual E2E Test Plan

## Discovered routes and endpoints
- Public route: `/`
- Public route: `/gdpr`
- Public route: `/partners`
- Public route: `/signup`
- Public route: `/contact`
- Public route: `/privacy`
- Public route: `/security`
- Public route: `/terms`
- API route: `POST /api/signup`
- API route: `POST /api/partner`
- API route: `GET /api/health`
- Redirect route: `GET /onboarding` redirects to `VAULT_URL` (or `/` if unset)
- Referenced but missing route: `/signin` is listed in `src/app/sitemap.ts` but no page exists

## Tests implemented
- Partner signup form: navigate to `/partners`, jump to the partner application form, verify client-side validation errors, submit valid data, and verify the success state.
- Customer signup form: navigate to `/signup`, verify API validation error via mocked 400 response, submit valid data, and verify redirect to `/`.
- Onboarding redirect: navigate to `/onboarding` and verify redirect location, using `PLAYWRIGHT_EXPECTED_ONBOARDING_REDIRECT` when provided.

## Placeholder failing tests (TODO)
- Trial gating / paywall flow: no paywall or trial components/routes found in the codebase.
- PDF generation flow: marketing pages mention PDF/ZIP audit packs but no generation endpoint exists.
- Auth enforcement and sign-in: no protected routes or auth middleware found and `/signin` is missing in `src/app`.

## Artifacts
- Step-by-step screenshots are captured for each test
- Failure screenshots, traces, and videos are retained automatically
- Artifacts are stored under `manual-tests/artifacts/`
