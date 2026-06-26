// ─── Groq API wrapper ─────────────────────────────────────────────────────────
// Model: llama-3.3-70b-versatile (free tier, fast, very capable)
// Docs: https://console.groq.com/docs
// Get your free key at: https://console.groq.com/keys

const GROQ_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

function groqHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.GROQ_API_KEY!}`,
  };
}

// ── JSON generation (Learn brief, Build challenge, Refine feedback) ───────────
export async function generateJSON<T>(
  userPrompt: string,
  systemPrompt: string,
  fallback: T
): Promise<T> {
  try {
    const res = await fetch(GROQ_URL, {
      method: "POST",
      headers: groqHeaders(),
      body: JSON.stringify({
        model: MODEL,
        temperature: 0.7,
        max_tokens: 1024,
        response_format: { type: "json_object" }, // Groq supports this — forces valid JSON
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user",   content: userPrompt   },
        ],
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      console.error("Groq API error:", res.status, err);
      return fallback;
    }

    const data = await res.json();
    const text = data.choices?.[0]?.message?.content ?? "";
    // response_format: json_object means no fences needed, but strip just in case
    const clean = text.replace(/```json|```/g, "").trim();
    return JSON.parse(clean) as T;
  } catch (error) {
    console.error("generateJSON error:", error);
    return fallback;
  }
}

// ── Streaming chat (Build coach) ──────────────────────────────────────────────
export async function streamChat(
  messages: { role: "user" | "assistant"; content: string }[],
  system: string
): Promise<ReadableStream> {
  const res = await fetch(GROQ_URL, {
    method: "POST",
    headers: groqHeaders(),
    body: JSON.stringify({
      model: MODEL,
      temperature: 0.75,
      max_tokens: 512,
      stream: true,
      messages: [
        { role: "system", content: system },
        ...messages,
      ],
    }),
  });

  if (!res.ok || !res.body) {
    throw new Error(`Groq stream error: ${res.status}`);
  }

  // Transform Groq's SSE stream into plain text chunks for the client
  const reader = res.body.getReader();
  const decoder = new TextDecoder();

  return new ReadableStream({
    async start(controller) {
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split("\n").filter((l) => l.startsWith("data: "));

          for (const line of lines) {
            const raw = line.replace("data: ", "").trim();
            if (raw === "[DONE]") continue;
            try {
              const json = JSON.parse(raw);
              const text = json.choices?.[0]?.delta?.content;
              if (text) {
                controller.enqueue(new TextEncoder().encode(text));
              }
            } catch {
              // malformed SSE line — skip
            }
          }
        }
      } finally {
        controller.close();
      }
    },
  });
}
