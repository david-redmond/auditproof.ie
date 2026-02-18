# Manual Playwright Tests

## What this is
Manual, workflow-focused Playwright tests for the GDPR app. Tests are tagged per workflow and capture step-by-step screenshots plus failure artifacts.

## Setup
1. Install dependencies: `npm install`
2. Install Playwright browsers: `npx playwright install`
3. Start the app: `npm run dev`

## Run with the interactive runner
- `node manual-tests/run-manual-tests.js`

The runner prompts for:
- Base URL (default `http://localhost:3000`)
- Workflow selection

The runner checks reachability before starting tests.

## Run via npm scripts
- `npm run manual-tests`

## Environment variables
- `PLAYWRIGHT_BASE_URL`: Base URL for tests (default `http://localhost:3000`).
- `PLAYWRIGHT_EXPECTED_ONBOARDING_REDIRECT`: Expected redirect target for `/onboarding` (optional).

## Artifacts
- Step screenshots and failure artifacts are saved under `manual-tests/artifacts/`.
- HTML report: `manual-tests/artifacts/html-report/`.

## Notes
- Partner and customer signup tests mock the `/api/partner` and `/api/signup` responses to verify success states without requiring backend services.
- Placeholder tests are expected to fail until the missing workflows/routes are implemented.
