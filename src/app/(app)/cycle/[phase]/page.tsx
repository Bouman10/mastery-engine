import { createClient } from "@/lib/supabase/server";
import { redirect, notFound } from "next/navigation";
import LearnPhase from "@/components/phases/LearnPhase";
import BuildPhase from "@/components/phases/BuildPhase";
import RefinePhase from "@/components/phases/RefinePhase";
import type { Track, Cycle } from "@/types";

type PhaseParam = "learn" | "build" | "refine";

export default async function CyclePage({ params }: { params: Promise<{ phase: string }> }) {
  const { phase } = await params;
  if (!["learn", "build", "refine"].includes(phase)) notFound();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: tracks } = await supabase
    .from("tracks").select("*").eq("user_id", user.id).eq("is_active", true).limit(1);
  if (!tracks?.length) redirect("/onboarding");
  const track = tracks[0] as Track;

  const { data: cycles } = await supabase
    .from("cycles").select("*").eq("track_id", track.id);
  const completedCycles = (cycles || []) as Cycle[];
  const cycleNumber = completedCycles.length + 1;

  return (
    <div className="max-w-2xl mx-auto px-6 py-8">
      {phase === "learn" && <LearnPhase track={track} cycleNumber={cycleNumber} />}
      {phase === "build" && <BuildPhase track={track} cycleNumber={cycleNumber} />}
      {phase === "refine" && <RefinePhase track={track} cycleNumber={cycleNumber} completedCycles={completedCycles} />}
    </div>
  );
}
