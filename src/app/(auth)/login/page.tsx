"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();
  const supabase = createClient();

  async function handleEmailLogin() {
    if (!email || !password) return;
    setLoading(true); setError("");
    const { error: err } = await supabase.auth.signInWithPassword({ email, password });
    if (err) setError(err.message);
    else router.push("/dashboard");
    setLoading(false);
  }

  async function handleGoogle() {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/dashboard` },
    });
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <Link href="/" className="block font-serif text-xl text-stone-900 text-center mb-8">
          Mastery
        </Link>

        <div className="bg-white border border-stone-200 rounded-2xl p-8">
          <h1 className="font-serif text-2xl text-stone-900 mb-1">Welcome back</h1>
          <p className="text-sm text-stone-500 mb-6">Sign in to continue your mastery journey.</p>

          <button
            onClick={handleGoogle}
            className="w-full flex items-center justify-center gap-3 border border-stone-200 rounded-xl py-2.5 text-sm font-medium text-stone-700 hover:border-stone-400 transition-colors mb-5"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-stone-200" />
            <span className="text-xs text-stone-400">or</span>
            <div className="flex-1 h-px bg-stone-200" />
          </div>

          <input
            type="email" value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:border-stone-900 outline-none transition-colors mb-3"
          />
          <input
            type="password" value={password} onChange={e => setPassword(e.target.value)}
            placeholder="Password" onKeyDown={e => e.key === "Enter" && handleEmailLogin()}
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:border-stone-900 outline-none transition-colors mb-4"
          />

          {error && <p className="text-sm text-red-600 mb-3">{error}</p>}

          <button
            onClick={handleEmailLogin} disabled={loading || !email || !password}
            className="w-full bg-stone-900 text-stone-50 font-semibold text-sm py-2.5 rounded-xl hover:bg-stone-800 disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>

          <p className="text-center text-sm text-stone-500 mt-4">
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
