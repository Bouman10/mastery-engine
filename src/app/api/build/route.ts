import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/groq";
import type { BuildChallenge } from "@/types";

export async function POST(req: NextRequest) {
  const { skill, duration, goal, cycleNumber } = await req.json();

  const totalCycles = duration === 30 ? 4 : duration === 60 ? 8 : 12;

  const challenge = await generateJSON<BuildChallenge>(
    `Create a practical build challenge for someone learning "${skill}".

Context:
- ${duration}-day learning path, ${totalCycles} total cycles
- This is cycle ${cycleNumber} of ${totalCycles}
- Their personal goal: "${goal}"

The challenge must:
- Be completely specific to "${skill}" — not generic
- Be achievable in the time allotted (early cycles simpler, later cycles more complex)
- Produce a real, tangible artifact or output
- Connect directly to their goal: "${goal}"

Return a JSON object with exactly these keys:
{
  "title": "specific project name relevant to ${skill}",
  "brief": "2-3 sentences describing exactly what to build with ${skill}. Be specific.",
  "requirements": [
    "specific requirement 1 — must use ${skill}",
    "specific requirement 2 — must use ${skill}",
    "specific requirement 3 — must use ${skill}"
  ],
  "deliverable": "exactly what they submit — be specific to what ${skill} produces",
  "time_estimate": "realistic time range e.g. '3-4 hours'"
}`,
    `You are an expert project-based learning designer specialising in ${skill}.
Every challenge must produce something real and specific to ${skill}.
Difficulty should match cycle ${cycleNumber} of ${totalCycles} — not too easy, not overwhelming.
Respond ONLY with a valid JSON object.`,
    {
      title: `${skill} — Cycle ${cycleNumber} Project`,
      brief: `Apply what you've learned this cycle to build a real ${skill} project. The goal is application over perfection.`,
      requirements: [
        `Build a working ${skill} output from scratch`,
        `Document the key decisions you made along the way`,
        `Identify at least one thing that surprised or challenged you`,
      ],
      deliverable: `A working ${skill} output plus a short writeup of your process and decisions.`,
      time_estimate: "3–5 hours",
    }
  );

  return NextResponse.json(challenge);
}