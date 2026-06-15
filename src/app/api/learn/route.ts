import { NextRequest, NextResponse } from "next/server";
import { generateJSON } from "@/lib/claude";
import type { LearnContent } from "@/types";

export async function POST(req: NextRequest) {
  const { skill, duration, goal, cycleNumber } = await req.json();

  const content = await generateJSON<LearnContent>(
    `Generate a structured learning brief for cycle ${cycleNumber} of mastering "${skill}" in a ${duration}-day path. Goal: "${goal}". Return JSON with keys: "concept" (the main concept this cycle), "why" (1 sentence on importance), "fundamentals" (array of 3 objects with "title" and "explanation" of max 2 sentences each), "map" (one mental model sentence), "first_step" (one specific action to take today).`,
    "You are a structured curriculum designer for ambitious learners aged 18-35. Be concrete and specific, never generic. Respond ONLY with valid JSON, no markdown fences.",
    {
      concept: `${skill} — Cycle ${cycleNumber} Foundations`,
      why: "Deep fundamentals create durable, transferable skill that compounds over time.",
      fundamentals: [
        { title: "Start with the why", explanation: "Understand the problem the skill solves before touching any tools. Context anchors every technique you learn after." },
        { title: "Build a mental model first", explanation: "Map the system before diving into details. Confusion comes from a missing picture, not missing information." },
        { title: "Feedback loops are everything", explanation: "Find the shortest path from action to signal. Fast feedback makes fast learning." },
      ],
      map: `${skill} is a system of interconnected decisions, each one constraining what comes next.`,
      first_step: `Write down one concrete output you will produce this cycle.`,
    }
  );

  return NextResponse.json(content);
}
