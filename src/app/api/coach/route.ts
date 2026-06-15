import { NextRequest } from "next/server";
import { streamChat } from "@/lib/claude";

export async function POST(req: NextRequest) {
  const { messages, skill, challengeTitle } = await req.json();

  const stream = await streamChat(
    messages,
    `You are a build coach helping someone master "${skill}". They're working on: "${challengeTitle}". Be direct and practical. Push them to think — ask the right questions, don't give answers directly. Keep responses under 120 words. Never be vague.`
  );

  return new Response(stream, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Transfer-Encoding": "chunked",
    },
  });
}
