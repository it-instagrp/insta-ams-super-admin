/**
 * FILE: components/common/ReusableComponents.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
/**
 * Shared UI primitives used across the Master Admin application.
 *
 * Keep visual classes here when the same UI pattern appears in multiple
 * feature areas. Feature components should supply data and callbacks only.
 * This keeps the UI consistent while making future backend integration easier.
 */
import type { LucideIcon } from "lucide-react";
import type { ButtonHTMLAttributes, InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";
import { Search } from "lucide-react";
import { colors } from "../../styles/theme";

// -----------------------------------------------------------------------------
// Button
// -----------------------------------------------------------------------------
export type ButtonVariant = "primary" | "secondary" | "danger";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  icon?: LucideIcon;
}

export function Button({ variant = "primary", icon: Icon, className = "", children, ...props }: ButtonProps) {
  const variantClass = {
    primary: "bg-primary text-white hover:bg-primary-dark",
    secondary: "border border-border bg-white text-text-muted hover:bg-primary-light",
    danger: "border border-error text-error hover:bg-error-bg",
  }[variant];

  return (
    <button
      {...props}
      className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium ${variantClass} ${className}`}
    >
      {Icon && <Icon size={16} strokeWidth={2} />}
      {children}
    </button>
  );
}

// -----------------------------------------------------------------------------
// SearchInput
// -----------------------------------------------------------------------------
interface SearchInputProps extends InputHTMLAttributes<HTMLInputElement> {
  widthClass?: string;
}

export function SearchInput({ widthClass = "w-[280px]", className = "", ...props }: SearchInputProps) {
  return (
    <div className={`relative ${widthClass}`}>
      <Search size={16} strokeWidth={1.8} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" />
      <input
        {...props}
        className={`h-10 w-full rounded-lg border border-border bg-white pl-9 pr-4 text-base text-text-primary outline-none placeholder:text-text-muted focus:border-primary ${className}`}
      />
    </div>
  );
}

// -----------------------------------------------------------------------------
// SelectField
// -----------------------------------------------------------------------------
interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
  widthClass?: string;
}

export function SelectField({ widthClass = "", className = "", children, ...props }: SelectFieldProps) {
  return (
    <select
      {...props}
      className={`h-10 rounded-lg border border-border bg-white px-3 text-base text-text-muted outline-none focus:border-primary ${widthClass} ${className}`}
    >
      {children}
    </select>
  );
}

// -----------------------------------------------------------------------------
// ModalShell
// -----------------------------------------------------------------------------
interface ModalShellProps {
  open: boolean;
  children: ReactNode;
  className?: string;
}

export function ModalShell({ open, children, className = "" }: ModalShellProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className={`w-full rounded-2xl bg-white shadow-xl ${className}`}>{children}</div>
    </div>
  );
}

// -----------------------------------------------------------------------------
// StatCard
// -----------------------------------------------------------------------------
interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeLabel?: string;
  icon: LucideIcon;
  iconColor?: string;
  iconBackground?: string;
  positive?: boolean;
}

export function StatCard({
  title,
  value,
  change,
  changeLabel = "vs last month",
  icon: Icon,
  iconColor = colors.primary,
  iconBackground = colors.primaryLight,
  positive = true,
}: StatCardProps) {
  return (
    <div className="surface-card group p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <h2 className="mt-2 text-3xl font-semibold leading-none text-text-primary">{value}</h2>
        </div>
        <div
          className="flex h-10 w-10 items-center justify-center rounded-full transition-transform duration-300 group-hover:scale-110 group-hover:rotate-6"
          style={{ backgroundColor: iconBackground, color: iconColor }}
        >
          <Icon size={20} strokeWidth={1.8} />
        </div>
      </div>
      {change && (
        <div className="mt-4 flex items-center gap-1.5 text-xs">
          <span className={`font-semibold ${positive ? "text-success" : "text-error"}`}>{change}</span>
          <span className="text-text-muted">{changeLabel}</span>
        </div>
      )}
    </div>
  );
}

// -----------------------------------------------------------------------------
// ConfirmDialog
// -----------------------------------------------------------------------------
interface ConfirmDialogProps {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  danger?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDialog({ open, title, message, confirmLabel = "Confirm", danger = false, onCancel, onConfirm }: ConfirmDialogProps) {
  if (!open) return null;

  return (
    <ModalShell open={open} className="max-w-sm p-6">
      <h2 className="text-lg font-semibold text-text-primary">{title}</h2>
      <p className="mt-2 text-sm text-text-muted">{message}</p>
      <div className="mt-6 flex items-center justify-end gap-3">
        <button onClick={onCancel} className="rounded-lg border border-border px-4 py-2 text-base font-medium text-text-muted hover:bg-primary-light">
          Cancel
        </button>
        <button
          onClick={onConfirm}
          className={`rounded-lg px-4 py-2 text-base font-medium text-white ${danger ? "bg-error hover:opacity-90" : "bg-primary hover:bg-primary-dark"}`}
        >
          {confirmLabel}
        </button>
      </div>
    </ModalShell>
  );
}
