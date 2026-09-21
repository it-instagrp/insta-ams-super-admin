/**
 * FILE: components/layout/Header.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  ChevronDown,
  Settings,
  LogOut,
} from "lucide-react";

import SettingsDrawer from "./SettingsDrawer";

import { useSettings } from "../../context/SettingsContext";
import { clearAuthentication, getAuthSession } from "../../services/authService";

export default function Header() {
  const [menuOpen, setMenuOpen] =
    useState(false);

  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [
    showLogoutConfirm,
    setShowLogoutConfirm,
  ] = useState(false);

  const menuRef =
    useRef<HTMLDivElement>(null);

  const {
    settings,
    getInitials,
  } = useSettings();

  useEffect(() => {
    function handleClickOutside(
      e: MouseEvent
    ) {
      if (
        menuRef.current &&
        !menuRef.current.contains(
          e.target as Node
        )
      ) {
        setMenuOpen(false);
      }
    }

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  const handleLogout = () => {
    clearAuthentication();

    setShowLogoutConfirm(false);
    setMenuOpen(false);

    window.location.replace(
      "/signin"
    );
  };

  const {
    name,
    email,
    jobTitle,
    photo,
  } = settings.profile;

  return (
    <>
      <div
        className="relative"
        ref={menuRef}
      >
        <button
          onClick={() =>
            setMenuOpen((o) => !o)
          }
          className="flex items-center gap-2 rounded-full border border-border bg-white py-1.5 pl-1.5 pr-3 shadow-[var(--shadow-soft)] transition-all hover:border-primary/30 hover:shadow-[var(--shadow-raised)]"
        >
          {photo ? (
            <img
              src={photo}
              alt={
                name || "Profile"
              }
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white gradient-primary">
              {getInitials()}
            </span>
          )}

          <span className="hidden text-left sm:block">
            <p className="max-w-40 truncate text-sm font-medium leading-tight text-text-primary">
              {name ||
                "Master Admin"}
            </p>

            <p className="max-w-40 truncate text-2xs leading-tight text-text-muted">
              {jobTitle ||
                "Platform Administrator"}
            </p>
          </span>

          <ChevronDown
            size={15}
            strokeWidth={1.8}
            className={`text-text-muted transition-transform duration-300 ${
              menuOpen
                ? "rotate-180"
                : ""
            }`}
          />
        </button>

        {menuOpen && (
          <div className="absolute right-0 top-full z-50 mt-2 w-60 overflow-hidden rounded-xl border border-border bg-white shadow-[var(--shadow-raised)]">
            <div className="border-b border-border px-4 py-3">
              <p className="truncate text-sm font-semibold text-text-primary">
                {name ||
                  "Master Admin"}
              </p>

              <p className="truncate text-xs text-text-muted">
                {email || getAuthSession()?.email || ""}
              </p>
            </div>

            <button
              onClick={() => {
                setMenuOpen(false);
                setSettingsOpen(true);
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-text-primary transition-colors hover:bg-primary/10 hover:text-primary-dark"
            >
              <Settings
                size={16}
                strokeWidth={1.8}
              />

              Settings
            </button>

            <button
              onClick={() => {
                setMenuOpen(false);
                setShowLogoutConfirm(
                  true
                );
              }}
              className="flex w-full items-center gap-2 px-4 py-2.5 text-left text-sm text-error transition-colors hover:bg-error-bg"
            >
              <LogOut
                size={16}
                strokeWidth={1.8}
              />

              Logout
            </button>
          </div>
        )}
      </div>

      <SettingsDrawer
        open={settingsOpen}
        onClose={() =>
          setSettingsOpen(false)
        }
      />

      {showLogoutConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-2xl border border-border bg-white p-6 shadow-[var(--shadow-raised)]">
            <div className="mb-4 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-error-bg">
                <LogOut
                  size={20}
                  className="text-error"
                />
              </div>

              <div>
                <h2 className="text-lg font-semibold text-text-primary">
                  Confirm Logout
                </h2>

                <p className="text-sm text-text-muted">
                  Are you sure you want to logout?
                </p>
              </div>
            </div>

            <p className="mb-6 text-sm text-text-secondary">
              You will be redirected to
              the sign in page and will
              need to sign in again.
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() =>
                  setShowLogoutConfirm(
                    false
                  )
                }
                className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-text-primary hover:bg-gray-50"
              >
                Cancel
              </button>

              <button
                onClick={handleLogout}
                className="rounded-lg bg-error px-4 py-2 text-sm font-medium text-white hover:opacity-90"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
