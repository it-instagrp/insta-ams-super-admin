# Master Admin - Backend Integration Guide

## API connection: authentication

- The Axios client in `src/services/apiClient.ts` uses `https://test-api.ams.instagrp.in/api/v1/` by default. Set `VITE_API_BASE_URL` to override it for another environment.
- Sign in calls `POST auth/login` with `email` and `password`. It accepts a token at `data.token` (as documented by the Postman collection), with support for common `accessToken` names.
- The token is held in session storage by default, or local storage when **Remember me** is selected. Every request through the shared client sends it as a Bearer token. A protected API response of 401 clears the session and returns to sign in.
- The prior development authentication flag no longer grants access. Logout clears both current and old authentication storage keys.
- Verify with a real Super Admin account: sign in, reload a protected route, check the Bearer header on an API request, log out, and verify the route redirects to sign in. Feature modules other than Dashboard still use local mock state until integrated.

## Dashboard

- `src/services/dashboardService.ts` loads stats, weekly trends, platform overview, platform status, and reminders through the shared Axios client.
- The overview period selector requests `3m`, `6m`, or `12m`. Refresh reloads the dashboard. Each section reports its own loading or error state; there is no mock-data fallback.
- Response field mappings were checked against the test API on 17 September 2026. The reminders endpoint returned an empty list at that time.

## Organizations

- The Organizations page calls `GET /organizations` with server search, status, plan, and pagination parameters. Details use `GET /organizations/:id` so deep links work after a reload.
- Create sends only fields documented for `POST /organizations`. Suspend, activate, and delete use the corresponding Super Admin endpoints and refresh the list after success. Errors stay visible without pretending a mutation succeeded.
- The list and detail response mapping, plus read-only filter behavior, were checked against the test API on 17 September 2026. No create, suspend, activate, or delete request was made during verification.

## Licenses

- The Licenses page uses `GET /licenses` for list rows and server supplied status counts. Search and status filters are sent to the API.
- Issue uses `POST /licenses/issue` with an explicitly entered amount, three-letter currency, and payment reference. The picker searches paginated organizations and excludes those already present in the full license list.
- Renew uses `POST /licenses/:id/renew`; cancel and reactivate use their respective `PATCH` endpoints. Successful actions reload server data. Errors remain visible in the dialog.
- The read-only list response shape and Active filter were checked against the test API on 17 September 2026. No license mutation was executed during verification.

## Reports

- `src/services/reportsService.ts` loads revenue, plan distribution, and top organizations through the shared Axios client. Revenue uses the selected `1m`, `3m`, `6m`, `12m`, or `ytd` period; the other two endpoints are period independent.
- Export calls `GET /reports/export` with the selected period and downloads the returned CSV. The selected currency is used for chart and table formatting.
- Response shapes, supported period values, and CSV response headers were checked against the test API on 17 September 2026. The old mock report data has been removed.

## Reminders

- `src/services/reminderService.ts` loads reminders with server search, type, and status filters. Resolve and snooze use `PATCH`; delete uses `DELETE` after an explicit confirmation.
- The UI refreshes from the server after successful actions and keeps request errors visible. The old mock reminders have been removed.
- The test API returned an empty `data` array for the list and filter checks on 17 September 2026, so a populated reminder field mapping and mutations could not be verified against live records.

## Users & Administrators

- The Users tab calls `GET /users` with server search, organization, enrollment, and page filters. The enrollment parameter is omitted for "All"; the test API rejects an empty value. Organization names come from the Organizations API and link to the detail screen.
- The Administrators tab calls `GET /admins` with server search and status filters. Suspend, activate, delete, and password reset link actions use the documented endpoints after confirmation, then refresh the list.
- List response shapes, Users page 2, enrollment filters, and the administrator Suspended filter were checked against the test API on 17 September 2026. No admin mutation or reset link request was executed during verification.

## Audit Logs

- `src/services/auditLogService.ts` loads `GET /audit-logs` with server search, category, actor, date range, and pagination parameters. The UI formats ISO timestamps in the browser's locale.
- The old mock records and fixed reference date have been removed. The actor filter accepts text because live actors include names outside the old fixed dropdown.
- The list response shape and `7d`, `30d`, `90d`, and `all` date values were checked against the test API on 17 September 2026. A final category/actor filter check hit HTTP 429, so those two filters remain for browser verification after the rate limit clears.

## Settings

- Profile, Security, Notifications, and Platform settings now load from their respective `GET /settings/*` endpoints and save through `PATCH /settings/*`. Each section has independent loading, error, and retry states.
- The sidebar and header use the authenticated account and server profile. Old demo settings and plaintext local password storage are removed. The profile email returned by the test API matched the login account, resolving the stale sidebar email.
- The test API's four read-only response shapes were checked on 17 September 2026. PATCH requests were not executed during verification. The Super Admin collection has no password-change endpoint, so the former local-only password control was removed.

## Architecture

- `src/types/` contains shared domain contracts.
- `src/data/` contains development-only seed/mock records.
- `src/services/` is the boundary for API/data access.
- `src/context/` exposes application state/actions to pages.
- `src/components/common/` contains shared UI primitives.
- Feature folders contain only feature-specific UI and behavior.

## Replacing mock data

When the backend is ready, keep the pages/components unchanged where possible.
Replace the development data source in `src/data/` / `src/context/` with API-backed
service functions. The UI already consumes typed records and callbacks instead of
embedding API details in individual components.

## Shared UI

Use the components exported from `src/components/common/index.ts` before creating
a new copy of a common control:

- `Button`
- `SearchInput`
- `SelectField`
- `ModalShell`
- `ConfirmDialog`
- `StatCard`

If a visual pattern is genuinely different, keep it feature-specific rather than
forcing unrelated designs into one generic component.
