"use client";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";

export default function AccountPage() {
  const [name, setName]               = useState("");
  const [email, setEmail]             = useState("");
  const [loading, setLoading]         = useState(true);
  const [saving, setSaving]           = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmReset, setConfirmReset]   = useState(false);
  const [deleting, setDeleting]       = useState(false);
  const [resetting, setResetting]     = useState(false);
  const [message, setMessage]         = useState<{ type: "success" | "error"; text: string } | null>(null);
  const supabase = createClient();
  const router   = useRouter();

  useEffect(() => {
    async function load() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push("/login"); return; }
      setEmail(user.email ?? "");
      const { data: profile } = await supabase
        .from("profiles").select("name").eq("id", user.id).single();
      setName(profile?.name ?? "");
      setLoading(false);
    }
    load();
  }, []);

  async function saveName() {
    setSaving(true); setMessage(null);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;
    const { error } = await supabase.from("profiles").update({ name: name.trim() }).eq("id", user.id);
    setMessage(error
      ? { type: "error",   text: "Could not save. Try again." }
      : { type: "success", text: "Name updated successfully." }
    );
    setSaving(false);
  }

  async function changePassword() {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user?.email) return;
    await supabase.auth.resetPasswordForEmail(user.email, {
      redirectTo: `${window.location.origin}/account`,
    });
    setMessage({ type: "success", text: "Password reset email sent — check your inbox." });
  }

  // ── START NEW SKILL ──────────────────────────────────────────────
  // Deactivates ALL current tracks, clears sessionStorage, sends to onboarding
  async function startNewSkill() {
    setResetting(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    // Deactivate all active tracks for this user
    await supabase
      .from("tracks")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("is_active", true);

    // Clear ALL session data — old skill, old submission, nothing carries over
    sessionStorage.removeItem("mastery_track");
    sessionStorage.removeItem("mastery_submission");

    setResetting(false);
    setConfirmReset(false);
    router.push("/onboarding");
  }

  // ── SIGN OUT ─────────────────────────────────────────────────────
  async function signOut() {
    // Clear session data before signing out
    sessionStorage.removeItem("mastery_track");
    sessionStorage.removeItem("mastery_submission");
    await supabase.auth.signOut();
    router.push("/");
  }

  // ── DELETE ACCOUNT ───────────────────────────────────────────────
  async function deleteAccount() {
    setDeleting(true);
    // Clear session data before deletion
    sessionStorage.removeItem("mastery_track");
    sessionStorage.removeItem("mastery_submission");
    await supabase.auth.signOut();
    router.push("/");
  }

  if (loading) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex gap-1.5">
        {[0,1,2].map(i => (
          <span key={i} className="w-2 h-2 rounded-full bg-stone-300 animate-pulse"
            style={{ animationDelay: `${i*0.2}s` }} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="max-w-lg mx-auto px-6 py-10">
      <h1 className="font-serif text-3xl text-stone-900 mb-1">Account settings</h1>
      <p className="text-sm text-stone-400 mb-8">Manage your Mastery profile and preferences.</p>

      {message && (
        <div className={`mb-6 px-4 py-3 rounded-xl text-sm font-medium ${
          message.type === "success"
            ? "bg-green-50 text-green-700 border border-green-200"
            : "bg-red-50 text-red-700 border border-red-200"
        }`}>
          {message.text}
        </div>
      )}

      {/* Profile */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-4">
        <h2 className="text-sm font-semibold text-stone-900 mb-4">Profile</h2>
        <div className="mb-4">
          <label className="block text-xs font-medium text-stone-500 mb-1.5">Display name</label>
          <input value={name} onChange={e => setName(e.target.value)} placeholder="Your name"
            className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:border-stone-900 outline-none bg-stone-50" />
        </div>
        <div className="mb-5">
          <label className="block text-xs font-medium text-stone-500 mb-1.5">Email</label>
          <input value={email} disabled
            className="w-full border border-stone-100 rounded-xl px-4 py-2.5 text-sm bg-stone-50 text-stone-400 cursor-not-allowed" />
        </div>
        <button onClick={saveName} disabled={saving || !name.trim()}
          className="w-full bg-stone-900 text-stone-50 font-semibold py-2.5 rounded-xl text-sm disabled:bg-stone-200 disabled:text-stone-400 hover:bg-stone-800 transition-colors"
          style={{ touchAction: "manipulation" }}>
          {saving ? "Saving…" : "Save name"}
        </button>
      </div>

      {/* Security */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-4">
        <h2 className="text-sm font-semibold text-stone-900 mb-1">Security</h2>
        <p className="text-xs text-stone-400 mb-4">We&apos;ll send a password reset link to your email.</p>
        <button onClick={changePassword}
          className="w-full border border-stone-200 text-stone-700 font-medium py-2.5 rounded-xl text-sm hover:border-stone-400 transition-colors bg-stone-50"
          style={{ touchAction: "manipulation" }}>
          Send password reset email
        </button>
      </div>

      {/* Start new skill — THE KEY FIX */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-4">
        <h2 className="text-sm font-semibold text-stone-900 mb-1">Learning path</h2>
        <p className="text-xs text-stone-400 mb-1">
          Want to master a different skill? Start a new path.
        </p>
        <p className="text-xs text-stone-400 mb-4">
          Your current cycle history is preserved. You&apos;ll begin fresh onboarding for your new skill.
        </p>

        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)}
            className="w-full border border-stone-200 text-stone-700 font-medium py-2.5 rounded-xl text-sm hover:border-stone-400 transition-colors bg-stone-50"
            style={{ touchAction: "manipulation" }}>
            Start a new skill →
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-stone-900 text-center">
              Your current active track will end. Ready?
            </p>
            <p className="text-xs text-stone-400 text-center">
              Past cycles are saved. You&apos;re just starting a new skill.
            </p>
            <button onClick={startNewSkill} disabled={resetting}
              className="w-full bg-stone-900 text-stone-50 font-semibold py-2.5 rounded-xl text-sm hover:bg-stone-700 transition-colors disabled:opacity-50"
              style={{ touchAction: "manipulation" }}>
              {resetting ? "Switching…" : "Yes, start a new skill"}
            </button>
            <button onClick={() => setConfirmReset(false)}
              className="w-full border border-stone-200 text-stone-600 font-medium py-2.5 rounded-xl text-sm hover:border-stone-400 transition-colors"
              style={{ touchAction: "manipulation" }}>
              Cancel
            </button>
          </div>
        )}
      </div>

      {/* Sign out */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 mb-4">
        <h2 className="text-sm font-semibold text-stone-900 mb-1">Session</h2>
        <p className="text-xs text-stone-400 mb-4">Sign out of your account on this device.</p>
        <button onClick={signOut}
          className="w-full border border-stone-200 text-stone-700 font-medium py-2.5 rounded-xl text-sm hover:border-stone-400 transition-colors bg-stone-50"
          style={{ touchAction: "manipulation" }}>
          Sign out
        </button>
      </div>

      {/* Danger zone */}
      <div className="bg-white border border-red-100 rounded-2xl p-6">
        <h2 className="text-sm font-semibold text-red-600 mb-1">Danger zone</h2>
        <p className="text-xs text-stone-400 mb-4">
          Deleting your account removes all tracks, cycles, and feedback permanently. This cannot be undone.
        </p>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)}
            className="w-full border border-red-200 text-red-600 font-medium py-2.5 rounded-xl text-sm hover:bg-red-50 transition-colors"
            style={{ touchAction: "manipulation" }}>
            Delete my account
          </button>
        ) : (
          <div className="space-y-2">
            <p className="text-sm font-semibold text-red-600 text-center">Are you absolutely sure?</p>
            <button onClick={deleteAccount} disabled={deleting}
              className="w-full bg-red-600 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-red-700 transition-colors disabled:opacity-50"
              style={{ touchAction: "manipulation" }}>
              {deleting ? "Deleting…" : "Yes, delete my account permanently"}
            </button>
            <button onClick={() => setConfirmDelete(false)}
              className="w-full border border-stone-200 text-stone-600 font-medium py-2.5 rounded-xl text-sm hover:border-stone-400 transition-colors"
              style={{ touchAction: "manipulation" }}>
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
}