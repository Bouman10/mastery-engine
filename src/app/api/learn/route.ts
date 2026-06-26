import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/groq";
import type { LearnContent } from "@/types";

export async function POST(req: NextRequest) {
  const { skill, duration, goal, cycleNumber } = await req.json();

  const totalCycles = duration === 30 ? 4 : duration === 60 ? 8 : 12;

  const content = await generateJSON<LearnContent>(
    `You are building a structured learning brief for someone mastering "${skill}".

Context:
- Their ${duration}-day learning path has ${totalCycles} total cycles
- This is cycle ${cycleNumber} of ${totalCycles}
- Their personal goal: "${goal}"

Generate a learning brief SPECIFIC to "${skill}" for this cycle. 
Earlier cycles cover fundamentals. Later cycles go deeper and more advanced.
Cycle ${cycleNumber} should cover the right depth for where they are in the journey.

Return a JSON object with exactly these keys:
{
  "concept": "the specific concept or skill area to focus on this cycle (be specific to ${skill})",
  "why": "one sentence on why this specific concept matters for mastering ${skill}",
  "fundamentals": [
    { "title": "principle 1 title", "explanation": "2 sentences max, specific to ${skill}" },
    { "title": "principle 2 title", "explanation": "2 sentences max, specific to ${skill}" },
    { "title": "principle 3 title", "explanation": "2 sentences max, specific to ${skill}" }
  ],
  "map": "one sentence mental model specific to how ${skill} works at this level",
  "first_step": "one concrete, specific action they can take TODAY to start — must be actionable for ${skill}"
}`,
    `You are an expert curriculum designer and coach specialising in ${skill}. 
You create structured, specific, actionable learning content. 
Never be generic. Every word must be relevant to ${skill} specifically.
Respond ONLY with a valid JSON object.`,
    {
      concept: `${skill} — Cycle ${cycleNumber} Core Concepts`,
      why: `This foundation is essential before building anything real with ${skill}.`,
      fundamentals: [
        { title: "Start with the mental model", explanation: `Before touching any tool in ${skill}, understand the underlying system. Every feature exists to solve a specific problem.` },
        { title: "Constraints reveal the design", explanation: `The best way to learn ${skill} is to hit its limits. Each constraint you find teaches you how the system actually works.` },
        { title: "Build before you perfect", explanation: `A working prototype in ${skill} teaches you 10x more than a perfect plan. Ship something ugly, then refine.` },
      ],
      map: `${skill} is a system of interconnected decisions — each one constraining and enabling what comes next.`,
      first_step: `Open ${skill} right now and identify one real problem you can solve with it this cycle.`,
    }
  );

  return NextResponse.json(content);
}
