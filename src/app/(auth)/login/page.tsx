"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail]                 = useState("");
  const [password, setPassword]           = useState("");
  const [loading, setLoading]             = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError]                 = useState("");
  const router   = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        if (event === "SIGNED_IN" && session) router.push("/dashboard");
      }
    );
    return () => subscription.unsubscribe();
  }, []);

  async function handleEmailLogin() {
    if (!email || !password || loading) return;
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) { setError(err.message); setLoading(false); }
  }

  async function handleGoogle() {
    if (googleLoading) return;
    setGoogleLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
        queryParams: { access_type: "offline", prompt: "consent" },
      },
    });
    if (err) { setError(err.message); setGoogleLoading(false); }
  }

  // touchend fires reliably on iOS Safari — e.preventDefault() stops
  // Safari from also firing a delayed synthetic click after the touch
  function onTouch(fn: () => void) {
    return (e: React.TouchEvent) => { e.preventDefault(); fn(); };
  }

  const btnBase: React.CSSProperties = {
    minHeight: 52,
    WebkitTapHighlightColor: "transparent",
    cursor: "pointer",
    touchAction: "manipulation",
  };

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block font-serif text-xl text-stone-900 text-center mb-8">
          Mastery
        </Link>

        <div className="bg-white border border-stone-200 rounded-2xl p-8">
          <h1 className="font-serif text-2xl text-stone-900 mb-1">Welcome back</h1>
          <p className="text-sm text-stone-500 mb-6 leading-relaxed">
            Sign in to continue your mastery journey.
          </p>

          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Google */}
          <button
            type="button"
            disabled={googleLoading}
            onClick={handleGoogle}
            onTouchEnd={onTouch(handleGoogle)}
            style={btnBase}
            className="w-full flex items-center justify-center gap-3 border border-stone-200 rounded-xl text-sm font-medium text-stone-700 bg-white active:bg-stone-100 disabled:opacity-50 mb-5"
          >
            {googleLoading ? (
              <span className="text-stone-400">Redirecting…</span>
            ) : (
              <>
                <GoogleIcon />
                Continue with Google
              </>
            )}
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-400">or</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <div className="space-y-3 mb-5">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              autoCapitalize="none"
              autoComplete="email"
              inputMode="email"
              style={{ minHeight: 52, touchAction: "manipulation" }}
              className="w-full border border-stone-200 rounded-xl px-4 text-sm focus:border-stone-900 outline-none bg-stone-50"
            />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              autoComplete="current-password"
              onKeyDown={(e) => e.key === "Enter" && handleEmailLogin()}
              style={{ minHeight: 52, touchAction: "manipulation" }}
              className="w-full border border-stone-200 rounded-xl px-4 text-sm focus:border-stone-900 outline-none bg-stone-50"
            />
          </div>

          {/* Sign in */}
          <button
            type="button"
            disabled={loading || !email || !password}
            onClick={handleEmailLogin}
            onTouchEnd={onTouch(handleEmailLogin)}
            style={btnBase}
            className="w-full flex items-center justify-center font-semibold text-sm rounded-xl transition-colors
              disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed
              bg-stone-900 text-stone-50 active:bg-stone-700"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-sm text-stone-500 mt-5">
            No account?{" "}
            <Link href="/signup" className="text-stone-900 font-semibold underline underline-offset-2">
              Sign up free
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
    </svg>
  );
}