/**
 * FILE: components/layout/Sidebar.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  CreditCard,
  BarChart3,
  Bell,
  Users,
  ClipboardList,
  ChevronsLeft,
  Settings,
} from "lucide-react";

import { useSettings } from "../../context/SettingsContext";
import { getAuthSession } from "../../services/authService";

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

const navigationItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Organizations",
    icon: Building2,
    path: "/organizations",
  },
  {
    label: "License",
    icon: CreditCard,
    path: "/licenses",
  },
  {
    label: "Reports",
    icon: BarChart3,
    path: "/reports",
  },
  {
    label: "Reminders",
    icon: Bell,
    path: "/reminders",
  },
  {
    label: "Users & Administrators",
    icon: Users,
    path: "/users",
  },
  {
    label: "Audit Logs",
    icon: ClipboardList,
    path: "/audit-logs",
  },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar({
  collapsed,
  onToggle,
}: SidebarProps) {
  const location = useLocation();

  const itemRefs =
    useRef<Record<string, HTMLAnchorElement | null>>(
      {}
    );

  const [indicatorTop, setIndicatorTop] =
    useState<number | null>(null);

  const {
    settings,
    getInitials,
  } = useSettings();

  useEffect(() => {
    const active = navigationItems.find(
      (item) =>
        item.path === location.pathname
    );

    const el = active
      ? itemRefs.current[active.path]
      : null;

    if (el) {
      setIndicatorTop(
        el.offsetTop +
          el.offsetHeight / 2 -
          12
      );
    } else {
      setIndicatorTop(null);
    }
  }, [
    location.pathname,
    collapsed,
  ]);

  const {
    name,
    email,
    photo,
  } = settings.profile;

  return (
    <aside
      className={`relative flex h-screen shrink-0 flex-col border-r border-border bg-white shadow-[var(--shadow-soft)] transition-[width] duration-300 ease-in-out ${
        collapsed
          ? "w-20"
          : "w-64"
      }`}
    >
      {/* Logo */}
      <div
        className={`flex items-center gap-2 px-6 pb-6 pt-6 ${
          collapsed
            ? "justify-center px-0"
            : "justify-between"
        }`}
      >
        {!collapsed && (
          <h1 className="whitespace-nowrap text-2xl font-bold text-gradient-primary">
            {settings.platform.platformName}
          </h1>
        )}

        <button
          onClick={onToggle}
          aria-label={
            collapsed
              ? "Expand sidebar"
              : "Collapse sidebar"
          }
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-text-muted transition-colors hover:bg-primary/10 hover:text-primary"
        >
          <ChevronsLeft
            size={24}
            className={`transition-transform duration-300 ${
              collapsed
                ? "rotate-180"
                : ""
            }`}
          />
        </button>
      </div>

      {/* Navigation */}
      <nav className="relative min-h-0 flex-1 overflow-y-auto px-3 pt-2">
        <span
          className="pointer-events-none absolute left-3 w-1 rounded-r-full gradient-primary transition-[top,opacity] duration-350"
          style={{
            top: indicatorTop ?? 0,
            height: 24,
            opacity:
              indicatorTop === null
                ? 0
                : 1,
          }}
        />

        <div className="space-y-2">
          {navigationItems.map(
            (item) => {
              const Icon = item.icon;

              const active =
                location.pathname ===
                item.path;

              return (
                <Link
                  key={item.label}
                  to={item.path}
                  ref={(el) => {
                    itemRefs.current[
                      item.path
                    ] = el;
                  }}
                  title={
                    collapsed
                      ? item.label
                      : undefined
                  }
                  className={`group relative flex items-center gap-3 overflow-hidden rounded-lg px-4 py-3 text-base transition-all duration-300 ${
                    collapsed
                      ? "justify-center px-0"
                      : ""
                  } ${
                    active
                      ? "bg-primary/10 font-semibold text-primary shadow-[var(--shadow-glow)]"
                      : "font-medium text-text-muted hover:translate-x-1 hover:bg-primary/10 hover:text-primary"
                  }`}
                >
                  <Icon
                    size={20}
                    className={`shrink-0 transition-transform duration-300 group-hover:scale-110 ${
                      active
                        ? "scale-110"
                        : ""
                    }`}
                  />

                  {!collapsed && (
                    <span className="whitespace-nowrap">
                      {item.label}
                    </span>
                  )}
                </Link>
              );
            }
          )}
        </div>
      </nav>

      {/* Profile */}
      <div
        className={`shrink-0 border-t border-border p-4 ${
          collapsed
            ? "flex justify-center"
            : ""
        }`}
      >
        <div className="flex items-center">
          {photo ? (
            <img
              src={photo}
              alt={name || "Profile"}
              className="h-9 w-9 shrink-0 rounded-full border border-primary/20 object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-sm font-semibold text-primary">
              {getInitials()}
            </div>
          )}

          {!collapsed && (
            <div className="ml-3 min-w-0">
              <p className="truncate text-sm font-semibold text-text-primary">
                {name || "Master Admin"}
              </p>

              <p className="truncate text-xs font-medium text-text-muted">
                {email || getAuthSession()?.email || ""}
              </p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
}
