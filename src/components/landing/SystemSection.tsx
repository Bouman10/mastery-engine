const phases = [
  { pct: "20%", phase: "Learn", color: "text-green-400", desc: "Fundamentals, mental map, first execution step. No fluff, no overload." },
  { pct: "60%", phase: "Build", color: "text-indigo-400", desc: "A real project. AI coach in session. You submit — or it didn't happen." },
  { pct: "20%", phase: "Refine", color: "text-amber-400", desc: "Mistake analysis. Pattern identification. Next cycle direction." },
];

export default function SystemSection() {
  return (
    <section id="system" className="bg-stone-900 py-20">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-[0.14em] uppercase text-stone-500 mb-2">
          The system
        </p>
        <h2 className="font-serif text-4xl md:text-5xl text-stone-50 leading-tight tracking-tight mb-12">
          One cycle.<br />
          <em className="text-stone-500">Repeated until mastery.</em>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
          {phases.map((p) => (
            <div key={p.phase} className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <div className={`font-serif text-4xl tracking-tight mb-1 ${p.color}`}>{p.pct}</div>
              <div className="font-semibold text-stone-50 text-base mb-2">{p.phase}</div>
              <div className="text-sm text-stone-500 leading-relaxed">{p.desc}</div>
            </div>
          ))}
        </div>
        <p className="text-sm text-stone-600 text-center leading-relaxed">
          Not intensity. Not streaks for the sake of streaks.<br />
          <em className="text-stone-500">Consistency + correction, compounding over time.</em>
        </p>
      </div>
    </section>
  );
}
