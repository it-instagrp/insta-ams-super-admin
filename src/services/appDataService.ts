/**
 * FILE: services/appDataService.ts
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
/**
 * Data-access contract for the Master Admin frontend.
 *
 * The UI should depend on these shapes/actions rather than a specific backend.
 * The current context still provides the local/mock implementation. When the
 * API is ready, replace the implementation behind this contract with fetch/
 * Axios calls without changing feature components.
 */
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export type AppDataService = Record<string, unknown>;
