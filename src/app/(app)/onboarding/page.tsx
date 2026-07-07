"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import type { Duration } from "@/types";

const SKILLS = [
  { id: "powerbi",       label: "Power BI" },
  { id: "python",        label: "Python" },
  { id: "design",        label: "UI/UX Design" },
  { id: "communication", label: "Communication" },
  { id: "excel",         label: "Excel & Data" },
  { id: "react",         label: "React" },
  { id: "leadership",    label: "Leadership" },
  { id: "marketing",     label: "Digital Marketing" },
  { id: "sql",           label: "SQL" },
  { id: "writing",       label: "Technical Writing" },
  { id: "figma",         label: "Figma" },
  { id: "finance",       label: "Personal Finance" },
  { id: "nodejs",        label: "Node.js" },
  { id: "speaking",      label: "Public Speaking" },
  { id: "ai",            label: "AI Tools" },
  { id: "content",       label: "Content Creation" },
];

const DURATIONS = [
  { days: 30 as Duration, sub: "Sprint",      cycles: 4,  desc: "Sharp focus. One skill, intense pace. Built for urgency." },
  { days: 60 as Duration, sub: "Deep Dive",   cycles: 8,  desc: "Two phases of growth. Time to correct and go deeper." },
  { days: 90 as Duration, sub: "Mastery Arc", cycles: 12, desc: "The full arc. Repeated cycles until the skill is truly yours." },
];

export default function OnboardingPage() {
  const [step, setStep]         = useState(0);
  const [skillId, setSkillId]   = useState<string | null>(null);
  const [custom, setCustom]     = useState("");
  const [duration, setDuration] = useState<Duration | null>(null);
  const [goal, setGoal]         = useState("");
  const [saving, setSaving]     = useState(false);
  const router   = useRouter();
  const supabase = createClient();

  const skillLabel =
    skillId === "__custom__"
      ? custom.trim()
      : SKILLS.find((s) => s.id === skillId)?.label ?? null;

  const selectedDuration = DURATIONS.find((d) => d.days === duration);

  async function finish() {
    if (!skillLabel || !duration || goal.trim().length < 10) return;
    setSaving(true);
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { router.push("/login"); return; }

    // ── Deactivate ALL previous active tracks ────────────────────
    // Prevents old skill from resurfacing on dashboard after reset
    await supabase
      .from("tracks")
      .update({ is_active: false })
      .eq("user_id", user.id)
      .eq("is_active", true);

    // Clear any stale session data from a previous skill or cycle
    sessionStorage.removeItem("mastery_track");
    sessionStorage.removeItem("mastery_submission");

    // Create the new track
    const { data: track, error } = await supabase
      .from("tracks")
      .insert({ user_id: user.id, skill: skillLabel, duration, goal: goal.trim(), is_active: true })
      .select()
      .single();

    if (error || !track) {
      console.error("Track insert error:", error);
      setSaving(false);
      return;
    }

    // Store fresh track in sessionStorage for phase components
    sessionStorage.setItem(
      "mastery_track",
      JSON.stringify({ id: track.id, skill: skillLabel, duration, goal: goal.trim() })
    );

    router.push("/dashboard");
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="border-b border-stone-200 px-6 py-3 flex items-center justify-between">
        <span className="font-serif text-lg text-stone-900">Mastery</span>
        <div className="flex items-center gap-2">
          {[0, 1, 2].map((i) => (
            <div key={i} className={`h-2 rounded-full transition-all duration-300 ${i === step ? "w-6 bg-stone-900" : i < step ? "w-4 bg-stone-400" : "w-2 bg-stone-200"}`} />
          ))}
        </div>
      </div>

      <div className="max-w-xl mx-auto px-6 py-10">

        {step === 0 && (
          <div className="animate-fade-up">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-stone-400 mb-2">Step 1 of 3</p>
            <h2 className="font-serif text-4xl text-stone-900 leading-tight tracking-tight mb-2">
              What do you want<br />to master?
            </h2>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">Pick a skill below, or type in anything you have in mind.</p>

            <div className="flex flex-wrap gap-2 mb-5">
              {SKILLS.map((s) => (
                <button key={s.id}
                  onClick={() => { setSkillId(s.id); setCustom(""); }}
                  className={`px-3.5 py-1.5 rounded-full border text-sm font-medium transition-all ${skillId === s.id ? "bg-stone-900 text-stone-50 border-stone-900" : "bg-white text-stone-600 border-stone-200 hover:border-stone-500"}`}>
                  {s.label}
                </button>
              ))}
            </div>

            <input value={custom}
              onChange={(e) => { setCustom(e.target.value); setSkillId(e.target.value.trim() ? "__custom__" : null); }}
              placeholder="Or type anything — Stoicism, Negotiation, Video Editing, Piano…"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:border-stone-900 outline-none mb-4 bg-white" />

            {skillLabel && (
              <p className="text-sm text-stone-500 mb-5">Selected: <strong className="text-stone-900">{skillLabel}</strong></p>
            )}

            <button disabled={!skillLabel} onClick={() => setStep(1)}
              className="w-full bg-stone-900 text-stone-50 font-semibold py-3 rounded-xl disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors">
              Continue →
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="animate-fade-up">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-stone-400 mb-2">Step 2 of 3</p>
            <h2 className="font-serif text-4xl text-stone-900 leading-tight tracking-tight mb-2">
              How much time<br />will you commit?
            </h2>
            <p className="text-sm text-stone-500 mb-6 leading-relaxed">
              Your <strong>{skillLabel}</strong> path adapts to this window. Longer = more cycles, deeper mastery.
            </p>

            <div className="flex flex-col gap-3 mb-6">
              {DURATIONS.map((d) => (
                <button key={d.days} onClick={() => setDuration(d.days)}
                  className={`w-full flex items-center gap-5 text-left p-5 rounded-xl border-2 transition-all ${duration === d.days ? "border-stone-900 bg-stone-900 text-stone-50" : "border-stone-200 bg-white hover:border-stone-400"}`}>
                  <div className="flex-shrink-0">
                    <div className={`font-serif text-4xl leading-none tracking-tight ${duration === d.days ? "text-stone-50" : "text-stone-900"}`}>{d.days}</div>
                    <div className="text-[10px] font-semibold uppercase tracking-[0.12em] text-stone-400">{d.sub}</div>
                  </div>
                  <div>
                    <div className={`font-semibold text-sm mb-1 ${duration === d.days ? "text-stone-50" : "text-stone-900"}`}>{d.days} days · {d.cycles} cycles</div>
                    <div className={`text-xs leading-relaxed ${duration === d.days ? "text-stone-400" : "text-stone-500"}`}>{d.desc}</div>
                  </div>
                  {duration === d.days && <span className="ml-auto text-stone-50 text-lg">check</span>}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button onClick={() => setStep(0)} className="border border-stone-200 rounded-xl px-5 py-3 text-sm font-medium hover:border-stone-400 transition-colors bg-white">Back</button>
              <button disabled={!duration} onClick={() => setStep(2)}
                className="flex-1 bg-stone-900 text-stone-50 font-semibold py-3 rounded-xl disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors">
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-up">
            <p className="text-xs font-semibold tracking-[0.14em] uppercase text-stone-400 mb-2">Step 3 of 3</p>
            <h2 className="font-serif text-4xl text-stone-900 leading-tight tracking-tight mb-2">
              What does success<br />look like?
            </h2>

            <div className="bg-stone-100 border border-stone-200 rounded-xl p-4 flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-stone-900 rounded-lg flex items-center justify-center flex-shrink-0 text-stone-50 text-lg">o</div>
              <div>
                <div className="font-semibold text-sm text-stone-900">{skillLabel}</div>
                <div className="text-xs text-stone-500">{duration}-day path · {selectedDuration?.cycles} cycles · {selectedDuration?.sub}</div>
              </div>
            </div>

            <p className="text-sm text-stone-500 mb-3 leading-relaxed">
              Be specific. A concrete outcome beats a vague ambition.
            </p>

            <textarea value={goal} onChange={(e) => setGoal(e.target.value)}
              placeholder={`In ${duration} days mastering ${skillLabel}, I want to be able to…`}
              rows={4}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:border-stone-900 outline-none resize-none leading-relaxed mb-5 bg-white" />

            <div className="flex gap-3">
              <button onClick={() => setStep(1)} className="border border-stone-200 rounded-xl px-5 py-3 text-sm font-medium hover:border-stone-400 transition-colors bg-white">Back</button>
              <button disabled={goal.trim().length < 10 || saving} onClick={finish}
                className="flex-1 bg-stone-900 text-stone-50 font-semibold py-3 rounded-xl disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors">
                {saving ? "Generating your path…" : "Generate my path"}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}