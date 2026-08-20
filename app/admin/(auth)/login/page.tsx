"use client";

import { useActionState } from "react";
import { signIn } from "@/app/admin/(auth)/login/actions";
import { siteConfig } from "@/lib/site-config";

export default function AdminLoginPage() {
  const [state, action, pending] = useActionState(signIn, undefined);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md space-y-8">
        {/* Brand */}
        <div className="text-center space-y-2">
          <h1 className="font-heading text-2xl md:text-3xl text-primary tracking-tighter">
            {siteConfig.name}
          </h1>
          <p className="text-muted-foreground text-sm">
            Admin Panel
          </p>
          <div className="h-0.5 w-16 mx-auto bg-linear-to-r from-primary to-gold" />
        </div>

        {/* Form Card */}
        <div className="bg-card rounded-xl shadow-lg p-6 md:p-8 space-y-6">
          {/* Form Title */}
          <div className="text-center">
            <h2 className="font-heading text-xl md:text-2xl text-foreground">
              Sign in to your account
            </h2>
            <p className="text-muted-foreground text-sm mt-1">
              Enter your credentials to continue
            </p>
          </div>

          {/* Form */}
          <form className="space-y-5" action={action}>
            {/* Email */}
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-muted-foreground">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="block w-full rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary-focus-ring focus:ring-offset-0 transition-all duration-200 placeholder:text-muted-foreground/50"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-2">
              <label htmlFor="password" className="block text-sm font-medium text-muted-foreground">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="block w-full rounded-lg border border-border px-4 py-3 text-sm font-medium text-foreground focus:border-primary focus:ring-2 focus:ring-primary-focus-ring focus:ring-offset-0 transition-all duration-200 placeholder:text-muted-foreground/50"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  className="rounded border-border text-primary focus:ring-primary focus:ring-offset-card bg-transparent w-4 h-4"
                />
                <span className="text-muted-foreground">Remember me</span>
              </label>
              <a href="#" className="text-primary hover:text-primary-dark transition-colors duration-200">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full flex items-center justify-center rounded-lg bg-primary px-5 py-3 text-sm font-medium text-primary-foreground hover:bg-primary-dark transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={pending}
            >
              {pending ? (
                <>
                  <span className="mr-2">Signing in...</span>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
                  </svg>
                </>
              ) : (
                "Sign in"
              )}
            </button>
          </form>

          {/* Error Message */}
          {state?.error && (
            <p className="text-center text-sm text-destructive">
              {state.error}
            </p>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-muted-foreground">
          &copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.
        </div>
      </div>
    </div>
  );
}