const durations = [
  { days: 30, sub: "Sprint", desc: "Sharp focus. One skill, intense pace. Built for urgency." },
  { days: 60, sub: "Deep Dive", desc: "Two phases of growth. Time to correct and go deeper." },
  { days: 90, sub: "Mastery Arc", desc: "The full arc. Repeated cycles until the skill is truly yours." },
];

export default function DurationSection() {
  return (
    <section className="bg-stone-100 border-y border-stone-200 py-20">
      <div className="max-w-3xl mx-auto px-6">
        <p className="text-xs font-semibold tracking-[0.12em] uppercase text-stone-400 mb-2">Three paths</p>
        <h3 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight leading-tight mb-10">
          Choose your commitment
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {durations.map((d) => (
            <div key={d.days} className="bg-white border border-stone-200 rounded-2xl p-6">
              <div className="font-serif text-5xl text-stone-900 tracking-tight leading-none mb-1">{d.days}</div>
              <div className="text-xs font-semibold uppercase tracking-[0.12em] text-stone-400 mb-3">
                days · {d.sub}
              </div>
              <div className="text-sm text-stone-500 leading-relaxed">{d.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
