import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
});

export async function generateJSON<T>(
  userPrompt: string,
  systemPrompt: string,
  fallback: T
): Promise<T> {
  try {
    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const text = message.content
      .filter((b) => b.type === "text")
      .map((b) => b.text)
      .join("");

    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as T;
  } catch (error) {
    console.error("Claude API error:", error);
    return fallback;
  }
}

export async function streamChat(
  messages: { role: "user" | "assistant"; content: string }[],
  system: string
): Promise<ReadableStream> {
  const stream = await client.messages.stream({
    model: "claude-sonnet-4-20250514",
    max_tokens: 512,
    system,
    messages,
  });

  return new ReadableStream({
    async start(controller) {
      for await (const chunk of stream) {
        if (
          chunk.type === "content_block_delta" &&
          chunk.delta.type === "text_delta"
        ) {
          controller.enqueue(new TextEncoder().encode(chunk.delta.text));
        }
      }
      controller.close();
    },
  });
}

export { client };
