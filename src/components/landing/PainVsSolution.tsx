const cols = [
  {
    label: "The trap",
    bad: true,
    items: [
      "Random YouTube rabbit holes",
      "AI answers with no direction",
      "10 articles, still confused",
      "Overstimulation and burnout",
      "Valley of despair. Again.",
    ],
  },
  {
    label: "The path",
    bad: false,
    items: [
      "One skill, one structured track",
      "AI curriculum built for your goal",
      "Real project every cycle",
      "Honest feedback on your gaps",
      "Consistency that compounds",
    ],
  },
];

export default function PainVsSolution() {
  return (
    <section className="max-w-3xl mx-auto px-6 py-20">
      <p className="text-xs font-semibold tracking-[0.14em] uppercase text-stone-400 text-center mb-2">
        The real problem
      </p>
      <h2 className="font-serif text-4xl md:text-5xl text-stone-900 leading-tight tracking-tight text-center mb-12">
        Abundance without structure<br />
        <em className="text-stone-400">creates despair, not growth.</em>
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cols.map((col) => (
          <div
            key={col.label}
            className={`rounded-2xl p-6 ${
              col.bad
                ? "bg-stone-100 border border-stone-200"
                : "bg-white border-2 border-stone-900"
            }`}
          >
            <p className={`text-xs font-semibold tracking-[0.12em] uppercase mb-4 ${col.bad ? "text-stone-400" : "text-stone-900"}`}>
              {col.label}
            </p>
            {col.items.map((item, i) => (
              <div key={i} className="flex gap-3 items-start mb-2.5">
                <span className={`text-sm mt-0.5 flex-shrink-0 ${col.bad ? "text-stone-400" : "text-green-600"}`}>
                  {col.bad ? "✕" : "✓"}
                </span>
                <span className={`text-sm leading-relaxed ${col.bad ? "text-stone-400" : "text-stone-600"}`}>
                  {item}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
