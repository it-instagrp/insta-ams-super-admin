/**
 * FILE: components/Settings/SettingsConfirmModal.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { AlertCircle, X } from "lucide-react";

interface SettingsConfirmModalProps {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  busy?: boolean;
  error?: string;
}

export default function SettingsConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  busy = false,
  error = "",
}: SettingsConfirmModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-raised)]">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary/10">
            <AlertCircle
              size={21}
              className="text-primary"
            />
          </div>

          <div className="min-w-0 flex-1">
            <h2 className="text-lg font-semibold text-text-primary">
              {title}
            </h2>

            <p className="mt-1 text-sm leading-5 text-text-muted">
              {message}
            </p>
          </div>

          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="rounded-md p-1 text-text-muted hover:bg-primary-light hover:text-text-primary"
          >
            <X size={18} />
          </button>
        </div>

        {error && <p role="alert" className="mt-4 text-sm text-error">{error}</p>}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            disabled={busy}
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={busy}
            onClick={onConfirm}
            className="rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            {busy ? "Saving…" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
}
