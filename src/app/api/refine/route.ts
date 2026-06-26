import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/groq";
import type { CycleFeedback } from "@/types";

export async function POST(req: NextRequest) {
  const { skill, duration, goal, cycleNumber, submission } = await req.json();

  const totalCycles = duration === 30 ? 4 : duration === 60 ? 8 : 12;

  const feedback = await generateJSON<CycleFeedback>(
    `Analyze this ${skill} submission from cycle ${cycleNumber} of ${totalCycles}.

Their goal: "${goal}"
Their submission: "${submission}"

Provide rigorous, specific feedback. Be honest. Do not encourage for the sake of it.
Every observation must reference ${skill} specifically — not generic learning advice.

Return a JSON object with exactly these keys:
{
  "headline": "one sharp, specific sentence summarising their cycle ${cycleNumber} performance in ${skill}",
  "strengths": [
    "specific strength 1 — what they did well in ${skill} and why it matters",
    "specific strength 2 — another concrete observation from their submission"
  ],
  "gaps": [
    "specific gap 1 — what's missing or wrong in their ${skill} work, and why",
    "specific gap 2 — another concrete thing to fix next cycle"
  ],
  "pattern": "the underlying thinking pattern or mental habit that's holding them back — not a task, a way of thinking",
  "next_cycle_focus": "one precise, specific focus area in ${skill} for cycle ${cycleNumber + 1}",
  "score": a number between 0 and 100 representing mastery signal for this cycle
}`,
    `You are a rigorous mastery coach specialising in ${skill}.
You give specific, honest, actionable feedback — never vague praise.
Your job is to accelerate real skill development, not to make people feel good.
Every piece of feedback must be specific to ${skill} and to what they actually submitted.
Respond ONLY with a valid JSON object.`,
    {
      headline: `You completed cycle ${cycleNumber} — that already puts you ahead of most people who start.`,
      strengths: [
        `You shipped something tangible in ${skill} — execution over perfection`,
        `Your submission shows active thinking, not passive consuming`,
      ],
      gaps: [
        `Your decision reasoning wasn't made explicit — why did you make these choices in ${skill}?`,
        `No capture of what surprised or broke your mental model`,
      ],
      pattern: "Execution without reflection — doing without processing what the experience taught you",
      next_cycle_focus: `Go deeper on one specific aspect of ${skill} rather than broader`,
      score: 55,
    }
  );

  return NextResponse.json(feedback);
}