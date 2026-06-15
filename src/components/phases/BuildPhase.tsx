"use client";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { Track, BuildChallenge } from "@/types";

export default function BuildPhase({ track, cycleNumber }: { track: Track; cycleNumber: number }) {
  const [challenge, setChallenge] = useState<BuildChallenge | null>(null);
  const [loading, setLoading] = useState(true);
  const [msgs, setMsgs] = useState<{ role: "user" | "assistant"; content: string }[]>([]);
  const [input, setInput] = useState("");
  const [thinking, setThinking] = useState(false);
  const [submitted, setSubmitted] = useState("");
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/build", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ skill: track.skill, duration: track.duration, goal: track.goal, cycleNumber }),
    }).then(r => r.json()).then(data => { setChallenge(data); setLoading(false); });
  }, []);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  async function sendMessage() {
    if (!input.trim() || thinking) return;
    const userMsg: { role: "user" | "assistant"; content: string } = { role: "user", content: input };
    const newMsgs = [...msgs, userMsg];
    setMsgs(newMsgs); setInput(""); setThinking(true);

    const res = await fetch("/api/coach", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages: newMsgs, skill: track.skill, challengeTitle: challenge?.title }),
    });

    const reader = res.body?.getReader();
    const decoder = new TextDecoder();
    let reply = "";
    setMsgs([...newMsgs, { role: "assistant", content: "" }]);

    if (reader) {
      while (true) {
        const { done: d, value } = await reader.read();
        if (d) break;
        reply += decoder.decode(value);
        setMsgs(prev => {
          const updated = [...prev];
          updated[updated.length - 1] = { role: "assistant", content: reply };
          return updated;
        });
      }
    }
    setThinking(false);
  }

  if (loading) return <div className="py-16 text-center text-sm text-stone-400">Generating your challenge…</div>;

  if (done) return (
    <div className="text-center py-16">
      <div className="font-serif text-5xl text-stone-900 mb-4">◈</div>
      <h2 className="font-serif text-2xl mb-2">Build phase complete.</h2>
      <p className="text-sm text-stone-500 mb-6">You shipped something. That&apos;s the whole point.</p>
      <button onClick={() => router.push("/cycle/refine")} className="bg-stone-900 text-stone-50 font-semibold px-8 py-3 rounded-xl hover:bg-stone-800 transition-colors">
        Get my feedback →
      </button>
    </div>
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-6 pb-4 border-b border-stone-200">
        <div className="flex gap-1.5">
          {["learn","build","refine"].map(p => <div key={p} className={`h-1.5 rounded-full transition-all duration-300 ${p === "build" ? "w-5 bg-stone-900" : "w-1.5 bg-stone-200"}`} />)}
        </div>
        <span className="text-xs text-stone-400">Cycle {cycleNumber}</span>
        <span className="ml-auto text-xs font-medium text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1 rounded-md">Build · 60%</span>
      </div>

      {challenge && (
        <div className="space-y-5">
          <div className="bg-blue-50 border border-blue-200 rounded-2xl p-5">
            <div className="flex justify-between items-start mb-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-blue-700">Your challenge</p>
              <span className="text-xs text-stone-400 bg-stone-100 rounded-md px-2 py-0.5">{challenge.time_estimate}</span>
            </div>
            <h2 className="font-serif text-2xl text-stone-900 mb-2">{challenge.title}</h2>
            <p className="text-sm text-stone-500 leading-relaxed mb-3">{challenge.brief}</p>
            {challenge.requirements.map((r, i) => (
              <div key={i} className="flex gap-2 mb-1.5">
                <span className="text-blue-400 text-xs mt-0.5">◦</span>
                <span className="text-sm text-stone-500 leading-relaxed">{r}</span>
              </div>
            ))}
          </div>

          {/* Coach chat */}
          <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden">
            <div className="px-4 py-2.5 border-b border-stone-100 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500 inline-block" />
              <span className="text-xs text-stone-400">Build coach — ask anything</span>
            </div>
            <div className="max-h-52 overflow-y-auto p-4 space-y-2">
              {msgs.length === 0 && <p className="text-sm text-stone-400 italic">Stuck? Describe where you are and I&apos;ll help you think through it.</p>}
              {msgs.map((m, i) => (
                <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[80%] text-sm leading-relaxed rounded-xl px-3.5 py-2 ${m.role === "user" ? "bg-stone-900 text-stone-50" : "bg-stone-100 text-stone-700"}`}>
                    {m.content}
                  </div>
                </div>
              ))}
              {thinking && <p className="text-xs text-stone-400">Thinking…</p>}
              <div ref={bottomRef} />
            </div>
            <div className="p-2.5 border-t border-stone-100 flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage()} placeholder="Ask your coach…"
                className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-2 text-sm focus:border-stone-400 outline-none" />
              <button onClick={sendMessage} className="bg-stone-900 text-stone-50 text-sm font-semibold px-3 py-2 rounded-lg hover:bg-stone-800 transition-colors">→</button>
            </div>
          </div>

          {/* Submission */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-stone-400 mb-1">Submit your deliverable</p>
            <p className="text-xs text-stone-400 mb-3">{challenge.deliverable}</p>
            <textarea value={submitted} onChange={e => setSubmitted(e.target.value)}
              placeholder="Paste your writeup, link, notes, or summary…" rows={4}
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:border-stone-900 outline-none resize-none leading-relaxed mb-3" />
            <button disabled={submitted.trim().length < 20} onClick={() => {
              sessionStorage.setItem("mastery_submission", submitted);
              setDone(true);
            }}
              className="w-full bg-stone-900 text-stone-50 font-semibold py-3.5 rounded-xl disabled:bg-stone-200 disabled:text-stone-400 disabled:cursor-not-allowed hover:bg-stone-800 transition-colors">
              Submit for review →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
