import { NextRequest } from "next/server";
import { streamChat } from "@/lib/groq";

export async function POST(req: NextRequest) {
  const { messages, skill, challengeTitle, goal } = await req.json();

  const system = `You are a build coach helping someone develop real skill in "${skill}".

Their current challenge: "${challengeTitle}"
Their learning goal: "${goal}"

Your coaching style:
- Be direct and specific to ${skill} — never give generic advice
- Ask the right questions rather than giving answers directly  
- Push them to think through problems themselves
- When they're truly stuck, give a concrete hint specific to ${skill}
- Keep responses under 120 words
- Reference actual ${skill} concepts, tools, and patterns in your responses`;

  try {
    const stream = await streamChat(messages, system);
    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        "X-Accel-Buffering": "no",
      },
    });
  } catch (error) {
    console.error("Coach stream error:", error);
    return new Response("Coach unavailable. Check your GROQ_API_KEY.", { status: 500 });
  }
}
