import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/claude";
import type { BuildChallenge } from "@/types";

export async function POST(req: NextRequest) {
  const { skill, duration, goal, cycleNumber } = await req.json();

  const challenge = await generateJSON<BuildChallenge>(
    `Create a practical build challenge for cycle ${cycleNumber} of mastering "${skill}" (${duration}-day path). Goal: "${goal}". Return JSON: "title" (challenge name), "brief" (2-3 sentences on what to build), "requirements" (array of 3-4 specific items), "deliverable" (what they submit for review), "time_estimate" (e.g. "3-5 hours").`,
    "You are a project-based learning designer. Challenges must be specific, achievable, and produce a real artifact. Respond ONLY with valid JSON.",
    {
      title: `${skill} — Cycle ${cycleNumber} Project`,
      brief: `Apply the fundamentals you learned to a real ${skill} project. The goal is application, not perfection.`,
      requirements: ["Build a working prototype or output", "Document your key decisions", "Note one thing that surprised or broke your mental model"],
      deliverable: "A short writeup of what you built, the decisions you made, and what you learned.",
      time_estimate: "3–5 hours",
    }
  );

  return NextResponse.json(challenge);
}
