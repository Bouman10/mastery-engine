import Hero from "@/components/landing/Hero";
import PainVsSolution from "@/components/landing/PainVsSolution";
import SystemSection from "@/components/landing/SystemSection";
import DurationSection from "@/components/landing/DurationSection";
import SkillTicker from "@/components/landing/SkillTicker";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-stone-50">
      {/* Nav */}
      <nav className="sticky top-0 z-50 bg-stone-50/90 backdrop-blur-sm border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-serif text-xl text-stone-900">Mastery</span>
          <div className="flex items-center gap-3">
            <a
              href="/login"
              className="text-sm font-medium text-stone-600 hover:text-stone-900 transition-colors px-3 py-1.5"
            >
              Sign in
            </a>
            <a
              href="/signup"
              className="text-sm font-semibold bg-stone-900 text-stone-50 rounded-lg px-4 py-1.5 hover:bg-stone-800 transition-colors"
            >
              Start free →
            </a>
          </div>
        </div>
      </nav>

      <Hero />
      <SkillTicker />
      <PainVsSolution />
      <SystemSection />
      <DurationSection />

      {/* Pull quote */}
      <section className="max-w-xl mx-auto px-6 py-24 text-center">
        <div className="font-serif text-5xl text-stone-200 leading-none mb-4">"</div>
        <p className="font-serif text-2xl md:text-3xl text-stone-900 leading-snug tracking-tight mb-4">
          The goal isn&apos;t to know everything. It&apos;s to know enough to act, and act enough to learn the rest.
        </p>
        <p className="text-sm text-stone-400">The principle behind Mastery Engine</p>
      </section>

      {/* Final CTA */}
      <section className="max-w-xl mx-auto px-6 pb-24 text-center">
        <h2 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight leading-tight mb-4">
          Your next 90 days<br />
          <em className="text-stone-400">will be different.</em>
        </h2>
        <p className="text-base text-stone-500 leading-relaxed mb-8 max-w-md mx-auto">
          No algorithm. No distraction. Just you, a structured path, and the discipline to repeat the cycle until the skill is real.
        </p>
        <a
          href="/signup"
          className="inline-block bg-stone-900 text-stone-50 font-semibold text-lg px-8 py-4 rounded-xl hover:bg-stone-800 transition-colors"
        >
          Start your path — it&apos;s free →
        </a>
      </section>

      <footer className="border-t border-stone-200 px-6 py-5 flex justify-between items-center max-w-5xl mx-auto">
        <span className="font-serif text-lg">Mastery</span>
        <span className="text-xs text-stone-400">Built for the ambitious. © 2025</span>
      </footer>
    </main>
  );
}
