"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import type { Track, LearnContent } from "@/types";

const PHASES = ["learn", "build", "refine"];

export default function LearnPhase({ track, cycleNumber }: { track: Track; cycleNumber: number }) {
  const [content, setContent] = useState<LearnContent | null>(null);
  const [loading, setLoading] = useState(true);
  const [read, setRead] = useState(false);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/learn", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill: track.skill, duration: track.duration, goal: track.goal, cycleNumber }),
    })
      .then(r => r.json())
      .then(data => { setContent(data); setLoading(false); });
  }, []);

  return (
    <div>
      <PhaseHeader active="learn" cycleNumber={cycleNumber} />

      {loading ? (
        <LoadingDots label="Generating your learning brief…" />
      ) : content ? (
        <div className="animate-fade-up space-y-5">
          <div className="bg-green-50 border border-green-200 rounded-2xl p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-green-700 mb-2">This cycle&apos;s concept</p>
            <h2 className="font-serif text-2xl text-stone-900 mb-2 leading-snug">{content.concept}</h2>
            <p className="text-sm text-stone-500 leading-relaxed">{content.why}</p>
          </div>

          <p className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400">Three fundamentals</p>
          {content.fundamentals.map((f, i) => (
            <div key={i} className="flex gap-4 pb-4 border-b border-stone-100">
              <div className="w-6 h-6 rounded-md bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 flex-shrink-0 mt-0.5">{i + 1}</div>
              <div>
                <div className="font-semibold text-sm text-stone-900 mb-1">{f.title}</div>
                <div className="text-sm text-stone-500 leading-relaxed">{f.explanation}</div>
              </div>
            </div>
          ))}

          <div className="bg-stone-100 border-l-4 border-green-400 pl-4 py-3 pr-4 rounded-r-xl">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-green-700 mb-1">Mental map</p>
            <p className="text-sm text-stone-600 italic leading-relaxed">{content.map}</p>
          </div>

          <div className="bg-green-50 border border-green-200 rounded-xl p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-green-700 mb-1">Your first step today</p>
            <p className="text-sm font-semibold text-stone-900 leading-relaxed">{content.first_step}</p>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <input type="checkbox" checked={read} onChange={e => setRead(e.target.checked)} className="w-4 h-4 accent-stone-900 rounded" />
            <span className="text-sm text-stone-500">I&apos;ve read and understood these fundamentals</span>
          </label>

          <button
            disabled={!read}
            onClick={() => router.push("/cycle/build")}
            className="w-full bg-stone-900 text-stone-50 font-semibold py-3.5 rounded-xl disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors"
          >
            Ready to build →
          </button>
        </div>
      ) : null}
    </div>
  );
}

function PhaseHeader({ active, cycleNumber }: { active: string; cycleNumber: number }) {
  return (
    <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-200">
      <div className="flex gap-1.5">
        {PHASES.map(p => (
          <div key={p} className={`h-1.5 rounded-full transition-all duration-300 ${p === active ? "w-5 bg-stone-900" : "w-1.5 bg-stone-200"}`} />
        ))}
      </div>
      <span className="text-xs text-stone-400">Cycle {cycleNumber}</span>
      <span className="ml-auto text-xs font-medium text-green-700 bg-green-50 border border-green-200 px-2.5 py-1 rounded-md">Learn · 20%</span>
    </div>
  );
}

function LoadingDots({ label }: { label: string }) {
  return (
    <div className="py-16 text-center">
      <div className="flex gap-1.5 justify-center mb-3">
        {[0, 1, 2].map(i => (
          <span key={i} className="w-2 h-2 rounded-full bg-stone-300 animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
        ))}
      </div>
      <p className="text-sm text-stone-400">{label}</p>
    </div>
  );
}
