/**
 * FILE: pages/signin.tsx
 * Purpose: Shared UI/data logic for the Master Admin application.
 * NOTE: Keep presentation unchanged when refactoring; move repeated logic into reusable modules.
 */
import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

import { setAuthenticated } from "../services/authService";

const loginBgUrl = "Login_background_2.png";

const Login = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginError, setLoginError] = useState("");

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setLoginError("");

    // Basic validation
    if (!email) {
      setLoginError("Please enter your email address.");
      return;
    }

    if (!password) {
      setLoginError("Please enter your password.");
      return;
    }

    if (password.length < 6) {
      setLoginError("Password must be at least 6 characters.");
      return;
    }

    try {
      setIsLoggingIn(true);

      /*
       * TEMPORARY LOGIN
       *
       * This is only for connecting the Sign In page
       * to your current frontend project.
       *
       * Later, replace this section with your backend
       * authentication API.
       */

      await new Promise((resolve) => setTimeout(resolve, 700));

      // Store login state temporarily
      setAuthenticated(email);

      // Redirect to Master Admin Dashboard
      navigate("/dashboard", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);
      setLoginError(
        "Unable to sign in. Please check your credentials and try again."
      );
    } finally {
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center lg:justify-start overflow-hidden">

      {/* =========================
          BACKGROUND
         ========================= */}
      <div
        className="absolute inset-0"
        aria-hidden="true"
      >
        <div
          className="absolute inset-0 scale-105 blur-[6px]"
          style={{
            backgroundImage: `url(${loginBgUrl})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        />

        {/* Dark overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(6,20,17,0.72) 0%, rgba(6,20,17,0.42) 38%, rgba(6,20,17,0.50) 62%, rgba(6,20,17,0.78) 100%)",
          }}
        />

        {/* Green glow */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 22% 42%, rgba(16,185,129,0.22) 0%, rgba(16,185,129,0.08) 32%, rgba(0,0,0,0) 60%)",
          }}
        />
      </div>

      {/* =========================
          LOGIN CONTENT
         ========================= */}
      <div className="relative z-10 w-full max-w-md px-4 lg:pl-20 lg:pr-4">

        {/* Heading */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.75)]">
            Insta Attend
          </h1>

          <p className="text-white/90 mt-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.75)]">
            HR Management System
          </p>
        </div>

        {/* Login Card */}
        <div
          className="
            w-full
            rounded-2xl
            border border-white/40
            bg-white/90
            backdrop-blur-xl
            shadow-[0_20px_60px_-15px_rgba(0,0,0,0.5)]
            p-6
          "
        >

          {/* Card Header */}
          <div className="space-y-2 mb-6">
            <h2 className="text-2xl font-semibold text-center text-gray-900">
              Sign In
            </h2>

            <p className="text-center text-sm text-gray-500">
              Enter your credentials to access your account
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Error */}
            {loginError && (
              <div
                role="alert"
                className="
                  rounded-md
                  border border-red-200
                  bg-red-50
                  px-3 py-2
                  text-sm
                  text-red-600
                "
              >
                {loginError}
              </div>
            )}

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Email
              </label>

              <div className="relative">
                <Mail
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    h-5 w-5
                    text-gray-400
                  "
                />

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="email@company.com"
                  autoComplete="email"
                  className="
                    w-full
                    h-10
                    rounded-md
                    border border-gray-300
                    bg-white
                    pl-10 pr-3
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-500/20
                  "
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Password
              </label>

              <div className="relative">
                <Lock
                  className="
                    absolute
                    left-3
                    top-1/2
                    -translate-y-1/2
                    h-5 w-5
                    text-gray-400
                  "
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className="
                    w-full
                    h-10
                    rounded-md
                    border border-gray-300
                    bg-white
                    pl-10 pr-10
                    text-sm
                    text-gray-900
                    outline-none
                    transition
                    focus:border-emerald-500
                    focus:ring-2
                    focus:ring-emerald-500/20
                  "
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="
                    absolute
                    right-1
                    top-1/2
                    -translate-y-1/2
                    h-8 w-8
                    flex
                    items-center
                    justify-center
                    rounded-md
                    text-gray-400
                    hover:text-gray-600
                    hover:bg-gray-100
                  "
                  aria-label={
                    showPassword ? "Hide password" : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="remember"
                  className="
                    h-4 w-4
                    rounded
                    border-gray-300
                    accent-emerald-500
                  "
                />

                <label
                  htmlFor="remember"
                  className="text-sm text-gray-600"
                >
                  Remember me
                </label>
              </div>

              <Link
                to="/forgot-password"
                className="
                  text-sm
                  text-emerald-600
                  hover:text-emerald-700
                "
              >
                Forgot password?
              </Link>

            </div>

            {/* Sign In Button */}
            <button
              type="submit"
              disabled={isLoggingIn}
              className="
                w-full
                h-10
                rounded-md
                bg-emerald-500
                hover:bg-emerald-600
                disabled:opacity-60
                disabled:cursor-not-allowed
                text-white
                text-sm
                font-medium
                transition
              "
            >
              {isLoggingIn ? "Signing in..." : "Sign in"}
            </button>

          </form>

          {/* Register */}
          <div className="flex justify-center border-t mt-6 pt-4">
            <p className="text-sm text-gray-500">
              Don't have an account?{" "}

              <Link
                to="/register"
                className="
                  text-emerald-600
                  hover:text-emerald-700
                  font-medium
                "
              >
                Create account
              </Link>
            </p>
          </div>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-white/90 drop-shadow-[0_2px_6px_rgba(0,0,0,0.6)]">
            © {new Date().getFullYear()} Insta Attend Inc. All rights reserved.
          </p>
        </div>

      </div>
    </div>
  );
};

export default Login;