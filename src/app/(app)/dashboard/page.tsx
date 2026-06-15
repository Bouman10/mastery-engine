import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Link from "next/link";
import type { Track, Cycle } from "@/types";

function getCycleCount(duration: number) {
  return duration === 30 ? 4 : duration === 60 ? 8 : 12;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tracks } = await supabase
    .from("tracks").select("*").eq("user_id", user.id).eq("is_active", true).limit(1);

  if (!tracks || tracks.length === 0) redirect("/onboarding");
  const track = tracks[0] as Track;

  const { data: cycles } = await supabase
    .from("cycles").select("*").eq("track_id", track.id).order("cycle_number", { ascending: true });

  const completedCycles = (cycles || []) as Cycle[];
  const totalCycles = getCycleCount(track.duration);
  const nextCycleNum = completedCycles.length + 1;
  const avg = completedCycles.length
    ? Math.round(completedCycles.reduce((a, c) => a + (c.score || 0), 0) / completedCycles.length)
    : null;
  const lastCycle = completedCycles[completedCycles.length - 1];

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-6">
        <p className="text-xs font-semibold tracking-[0.14em] uppercase text-stone-400 mb-1">{track.duration}-day path</p>
        <h1 className="font-serif text-3xl md:text-4xl text-stone-900 tracking-tight mb-2">{track.skill}</h1>
        <p className="text-sm text-stone-500 leading-relaxed">{track.goal}</p>
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-stone-400 mb-2">
          <span>Progress</span>
          <span>Cycle {completedCycles.length} / {totalCycles}</span>
        </div>
        <div className="h-1.5 bg-stone-200 rounded-full">
          <div
            className="h-full bg-stone-900 rounded-full transition-all duration-700"
            style={{ width: `${Math.round((completedCycles.length / totalCycles) * 100)}%` }}
          />
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          { label: "Cycles done", value: completedCycles.length },
          { label: "Avg. score", value: avg ?? "—" },
          { label: "Days left", value: track.duration },
        ].map(s => (
          <div key={s.label} className="bg-white border border-stone-200 rounded-xl p-4">
            <p className="text-xs text-stone-400 uppercase tracking-[0.1em] mb-1.5">{s.label}</p>
            <p className="font-serif text-3xl text-stone-900">{s.value}</p>
          </div>
        ))}
      </div>

      {/* Last feedback */}
      {lastCycle?.feedback && (
        <div className="bg-white border border-stone-200 rounded-xl p-5 mb-5">
          <p className="text-xs text-stone-400 uppercase tracking-[0.1em] mb-3">Last cycle feedback</p>
          <p className="text-sm text-stone-500 italic leading-relaxed mb-2">"{(lastCycle.feedback as any).headline}"</p>
          <p className="text-sm text-blue-600 font-medium">→ {(lastCycle.feedback as any).next_cycle_focus}</p>
        </div>
      )}

      {/* Phase reminder */}
      <div className="flex gap-2 mb-6">
        {[
          { label: "Learn", pct: "20%", color: "text-green-600 bg-green-50 border-green-200" },
          { label: "Build", pct: "60%", color: "text-blue-700 bg-blue-50 border-blue-200" },
          { label: "Refine", pct: "20%", color: "text-amber-700 bg-amber-50 border-amber-200" },
        ].map(p => (
          <div key={p.label} className={`flex-1 rounded-lg border py-2 text-center ${p.color}`}>
            <div className="text-xs font-semibold">{p.label}</div>
            <div className="text-xs opacity-70">{p.pct}</div>
          </div>
        ))}
      </div>

      {nextCycleNum <= totalCycles ? (
        <Link
          href="/cycle/learn"
          className="block w-full bg-stone-900 text-stone-50 font-semibold text-base text-center py-4 rounded-xl hover:bg-stone-800 transition-colors"
        >
          {completedCycles.length === 0 ? "Start cycle 1 →" : `Start cycle ${nextCycleNum} →`}
        </Link>
      ) : (
        <div className="text-center py-8">
          <div className="font-serif text-4xl mb-3">◈</div>
          <h2 className="font-serif text-2xl mb-2">Path complete.</h2>
          <p className="text-sm text-stone-500">You finished all {totalCycles} cycles. That&apos;s mastery in progress.</p>
        </div>
      )}
    </div>
  );
}
