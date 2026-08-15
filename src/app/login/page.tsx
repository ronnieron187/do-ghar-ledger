"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

type Mode = "signin" | "signup";

export default function LoginPage() {
  const router = useRouter();
  const supabase = createClient();

  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  async function handleGoogleSignIn() {
    setError("");
    setGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/auth/callback?next=/dashboard` },
    });
    if (error) {
      setError(error.message);
      setGoogleLoading(false);
    }
    // On success, Supabase redirects the browser away, so no further action needed here.
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setMessage("");
    setLoading(true);

    try {
      if (mode === "signin") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push("/dashboard");
        router.refresh();
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
        });
        if (error) throw error;
        setMessage("Check your email to confirm your account, then sign in.");
      }
    } catch (err: any) {
      setError(err.message ?? "Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-10 relative overflow-hidden">
      {/* Ambient background shapes */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 -left-24 h-96 w-96 rounded-full bg-nz/10 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-pk/10 blur-3xl"
      />

      <div className="relative w-full max-w-[420px] animate-rise">
        {/* Brand mark */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-2 w-2 rounded-full bg-nz" />
            <span className="text-mist text-xs tracking-[0.3em] uppercase">
              New Zealand
            </span>
            <span className="text-line">/</span>
            <span className="text-mist text-xs tracking-[0.3em] uppercase">
              Pakistan
            </span>
            <span className="h-2 w-2 rounded-full bg-pk" />
          </div>
          <h1 className="font-display text-4xl font-medium">Fern &amp; Fifty</h1>
          <p className="text-mist text-sm mt-2 max-w-xs">
            Your money, tracked across two homes and two currencies.
          </p>
        </div>

        {/* Card */}
        <div className="rounded-card border border-line bg-surface shadow-card p-7">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={googleLoading}
            className="w-full flex items-center justify-center gap-2.5 rounded-md border border-line bg-surface2 text-ivory font-medium text-sm py-2.5 hover:border-mist transition disabled:opacity-50 disabled:cursor-not-allowed mb-5"
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M17.64 9.2c0-.64-.06-1.25-.16-1.84H9v3.48h4.84c-.21 1.13-.84 2.09-1.8 2.73v2.27h2.92c1.7-1.57 2.68-3.88 2.68-6.64z"
              />
              <path
                fill="#34A853"
                d="M9 18c2.43 0 4.47-.8 5.96-2.18l-2.92-2.27c-.81.54-1.85.86-3.04.86-2.34 0-4.32-1.58-5.03-3.7H.96v2.34C2.44 15.98 5.48 18 9 18z"
              />
              <path
                fill="#FBBC05"
                d="M3.97 10.71A5.4 5.4 0 013.68 9c0-.59.1-1.17.29-1.71V4.96H.96A9 9 0 000 9c0 1.45.35 2.83.96 4.04l3.01-2.33z"
              />
              <path
                fill="#EA4335"
                d="M9 3.58c1.32 0 2.51.45 3.44 1.35l2.58-2.58C13.46.89 11.43 0 9 0 5.48 0 2.44 2.02.96 4.96l3.01 2.33C4.68 5.16 6.66 3.58 9 3.58z"
              />
            </svg>
            {googleLoading ? "Redirecting…" : "Continue with Google"}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="h-px flex-1 bg-line" />
            <span className="text-mist text-xs uppercase tracking-wider">or</span>
            <div className="h-px flex-1 bg-line" />
          </div>

          {/* Mode switch */}
          <div className="grid grid-cols-2 gap-1 mb-6 rounded-md bg-surface2 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("signin");
                setError("");
                setMessage("");
              }}
              className={`py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "signin"
                  ? "bg-nz text-ink"
                  : "text-mist hover:text-ivory"
              }`}
            >
              Sign in
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
                setMessage("");
              }}
              className={`py-2 rounded-md text-sm font-medium transition-colors ${
                mode === "signup"
                  ? "bg-nz text-ink"
                  : "text-mist hover:text-ivory"
              }`}
            >
              Create account
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-mist text-xs mb-1.5">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full bg-surface2 border border-line rounded-md px-3.5 py-2.5 text-sm outline-none focus-visible:border-nz transition-colors"
              />
            </div>
            <div>
              <label className="block text-mist text-xs mb-1.5">Password</label>
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-surface2 border border-line rounded-md px-3.5 py-2.5 text-sm outline-none focus-visible:border-nz transition-colors"
              />
            </div>

            {error && (
              <div className="text-alert text-sm rounded-md bg-alert/10 border border-alert/30 px-3 py-2">
                {error}
              </div>
            )}
            {message && (
              <div className="text-good text-sm rounded-md bg-good/10 border border-good/30 px-3 py-2">
                {message}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md bg-nz text-ink font-semibold text-sm py-2.5 hover:brightness-110 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? "Please wait…"
                : mode === "signin"
                ? "Sign in"
                : "Create account"}
            </button>
          </form>
        </div>

        <p className="text-mist text-xs text-center mt-6">
          Your data is private to your account and stored securely — never shared
          between users.
        </p>
      </div>
    </main>
  );
}
