import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/claude";
import type { CycleFeedback } from "@/types";

export async function POST(req: NextRequest) {
  const { skill, duration, goal, cycleNumber, submission } = await req.json();

  const feedback = await generateJSON<CycleFeedback>(
    `Analyze this ${skill} submission (cycle ${cycleNumber}, ${duration}-day path, goal: "${goal}"): "${submission}". Return JSON: "headline" (1 sharp, specific sentence), "strengths" (array of 2 specific observations), "gaps" (array of 2 specific things to improve), "pattern" (the underlying thinking pattern to break — not a task, a mental habit), "next_cycle_focus" (1 precise focus area), "score" (0-100 mastery signal for this cycle).`,
    "You are a rigorous mastery coach. Be specific and honest, never vague or encouraging for the sake of it. The feedback must be useful. Respond ONLY with valid JSON.",
    {
      headline: "You completed the cycle — that already puts you ahead of most.",
      strengths: ["You shipped something tangible and real", "Your documentation shows active thinking, not passive consuming"],
      gaps: ["Decision reasoning wasn't made explicit — why these choices?", "No capture of what surprised or broke your mental model"],
      pattern: "Execution without reflection — doing without processing what you learned",
      next_cycle_focus: `Go deeper on one specific aspect of ${skill} rather than broader`,
      score: 55,
    }
  );

  return NextResponse.json(feedback);
}
