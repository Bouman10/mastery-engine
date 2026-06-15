export default function Hero() {
  return (
    <section className="max-w-3xl mx-auto px-6 pt-24 pb-12 text-center">
      <div className="animate-fade-up inline-flex items-center gap-2 bg-white border border-stone-200 rounded-full px-4 py-1.5 text-xs font-medium text-stone-500 mb-8">
        <span className="w-1.5 h-1.5 rounded-full bg-green-500 inline-block" />
        For ambitious minds 18–35 done with random learning
      </div>

      <h1 className="animate-fade-up animation-delay-100 font-serif text-5xl md:text-7xl text-stone-900 leading-[1.06] tracking-[-0.025em] mb-6">
        Stop consuming.<br />
        <em className="text-stone-400">Start mastering.</em>
      </h1>

      <p className="animate-fade-up animation-delay-200 text-lg md:text-xl text-stone-500 leading-relaxed max-w-lg mx-auto mb-10">
        You don&apos;t have an information problem. You have a structure problem. Mastery gives you a
        disciplined path — 20% learn, 60% build, 20% refine — until the skill is real.
      </p>

      <div className="animate-fade-up animation-delay-300 flex items-center justify-center gap-3 flex-wrap">
        <a
          href="/signup"
          className="bg-stone-900 text-stone-50 font-semibold text-base px-7 py-3.5 rounded-xl hover:bg-stone-800 transition-colors"
        >
          Begin your path →
        </a>
        <a
          href="#system"
          className="text-stone-700 font-medium text-base border border-stone-200 px-5 py-3.5 rounded-xl hover:border-stone-400 transition-colors"
        >
          See the system
        </a>
      </div>
    </section>
  );
}
