"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { Track, Cycle, CycleFeedback } from "@/types";

export default function RefinePhase({ track, cycleNumber, completedCycles }: { track: Track; cycleNumber: number; completedCycles: Cycle[] }) {
  const [feedback, setFeedback] = useState<CycleFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    const submission = sessionStorage.getItem("mastery_submission") || "No submission provided.";
    fetch("/api/refine", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill: track.skill, duration: track.duration, goal: track.goal, cycleNumber, submission }),
    })
      .then((r) => r.json())
      .then((data) => { setFeedback(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function completeCycle() {
    if (!feedback) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }
    await supabase.from("cycles").insert({
      track_id: track.id,
      user_id: user.id,
      cycle_number: cycleNumber,
      submission: sessionStorage.getItem("mastery_submission"),
      score: feedback.score,
      feedback,
    });
    sessionStorage.removeItem("mastery_submission");
    router.push("/dashboard");
  }

  const scoreColor = feedback
    ? feedback.score >= 70 ? "#16a34a" : feedback.score >= 45 ? "#b45309" : "#dc2626"
    : "#e5e7eb";

  if (loading) return (
    <div className="py-16 text-center">
      <div className="flex gap-1.5 justify-center mb-3">
        {[0,1,2].map((i) => <span key={i} className="w-2 h-2 rounded-full bg-stone-300 animate-pulse" style={{ animationDelay: `${i*0.2}s` }} />)}
      </div>
      <p className="text-sm text-stone-400">Analysing your {track.skill} work…</p>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-200">
        <div className="flex gap-1.5">
          {["learn","build","refine"].map((p) => (
            <div key={p} className={`h-1.5 rounded-full transition-all ${p === "refine" ? "w-5 bg-stone-900" : "w-1.5 bg-stone-200"}`} />
          ))}
        </div>
        <span className="text-xs text-stone-400">{track.skill} · Cycle {cycleNumber}</span>
        <span className="ml-auto text-xs font-medium text-amber-700 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-md">Refine · 20%</span>
      </div>

      {feedback && (
        <div className="animate-fade-up space-y-4">
          <div className="text-center py-4">
            <svg width="96" height="96" viewBox="0 0 96 96" className="block mx-auto mb-2">
              <circle cx="48" cy="48" r="38" fill="none" stroke="#e5e7eb" strokeWidth="5" />
              <circle cx="48" cy="48" r="38" fill="none" stroke={scoreColor} strokeWidth="5"
                strokeDasharray={`${(feedback.score / 100) * 239} 239`} strokeLinecap="round"
                transform="rotate(-90 48 48)" />
              <text x="48" y="53" textAnchor="middle" fontSize="20" fontWeight="600" fill="#1A1917" fontFamily="Georgia, serif">{feedback.score}</text>
            </svg>
            <p className="text-xs text-stone-400">{track.skill} · Cycle {cycleNumber} mastery signal</p>
          </div>

          <div className="bg-stone-100 rounded-2xl p-5">
            <p className="font-serif text-lg text-stone-900 italic leading-snug">&ldquo;{feedback.headline}&rdquo;</p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-green-700 mb-2">What worked</p>
              {feedback.strengths.map((s, i) => <p key={i} className="text-sm text-stone-600 leading-relaxed mb-1">+ {s}</p>)}
            </div>
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
              <p className="text-xs font-semibold uppercase tracking-[0.1em] text-amber-700 mb-2">What to fix</p>
              {feedback.gaps.map((g, i) => <p key={i} className="text-sm text-stone-600 leading-relaxed mb-1">△ {g}</p>)}
            </div>
          </div>

          <div className="bg-amber-50 border-l-4 border-amber-400 pl-4 py-3 pr-4 rounded-r-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-amber-700 mb-1">Pattern to break</p>
            <p className="text-sm text-stone-600 leading-relaxed">{feedback.pattern}</p>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-blue-700 mb-1">Next cycle focus</p>
            <p className="text-sm font-semibold text-stone-900 leading-relaxed">{feedback.next_cycle_focus}</p>
          </div>

          <button onClick={completeCycle} disabled={saving}
            className="w-full bg-stone-900 text-stone-50 font-semibold py-3.5 rounded-xl disabled:bg-stone-200 hover:bg-stone-800 transition-colors">
            {saving ? "Saving…" : `Complete cycle ${cycleNumber} →`}
          </button>
        </div>
      )}
    </div>
  );
}