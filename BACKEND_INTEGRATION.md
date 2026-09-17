# Master Admin - Backend Integration Guide

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
