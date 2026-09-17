/**
 * FILE: components/layout/MainLayout.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-dashboard-bg">
      <Sidebar collapsed={collapsed} onToggle={() => setCollapsed((c) => !c)} />
      <div className="flex min-w-0 flex-1 flex-col overflow-hidden">
        <main className="min-w-0 flex-1 overflow-y-auto bg-dashboard-bg">
          <div className="flex items-center justify-end px-6 pt-4 pb-1">
            <Header />
          </div>
          <div className="px-6 pb-6">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}