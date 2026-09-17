/**
 * FILE: App.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import type {
  ReactNode,
} from "react";

import { isAuthenticated } from "./services/authService";

import {
  AppDataProvider,
} from "./context/AppDataContext";

import {
  SettingsProvider,
} from "./context/SettingsContext";

import MainLayout from "./components/layout/MainLayout";

import Dashboard from "./pages/Dashboard";
import Organizations from "./pages/Organizations";
import OrganizationDetail from "./pages/OrganizationDetail";
import UsersAdministrators from "./pages/UsersAdministrators";
import Licenses from "./pages/Licenses";
import Reports from "./pages/Reports";
import AuditLogs from "./pages/AuditLogs";
import Reminders from "./pages/Reminders";
import Login from "./pages/signin";

function ProtectedRoute({
  children,
}: {
  children: ReactNode;
}) {
  return isAuthenticated() ? (
    children
  ) : (
    <Navigate
      to="/signin"
      replace
    />
  );
}

function App() {
  return (
    <SettingsProvider>
      <AppDataProvider>
        <BrowserRouter>
          <Routes>
            <Route
              path="/signin"
              element={<Login />}
            />

            <Route
              element={
                <ProtectedRoute>
                  <MainLayout />
                </ProtectedRoute>
              }
            >
              <Route
                path="/dashboard"
                element={<Dashboard />}
              />

              <Route
                path="/organizations"
                element={<Organizations />}
              />

              <Route
                path="/organizations/:id"
                element={
                  <OrganizationDetail />
                }
              />

              <Route
                path="/users"
                element={
                  <UsersAdministrators />
                }
              />

              <Route
                path="/licenses"
                element={<Licenses />}
              />

              <Route
                path="/reports"
                element={<Reports />}
              />

              <Route
                path="/audit-logs"
                element={<AuditLogs />}
              />

              <Route
                path="/reminders"
                element={<Reminders />}
              />
            </Route>

            <Route
              path="*"
              element={
                <Navigate
                  to="/dashboard"
                  replace
                />
              }
            />
          </Routes>
        </BrowserRouter>
      </AppDataProvider>
    </SettingsProvider>
  );
}

export default App;