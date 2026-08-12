import Link from "next/link";
import { Zap, Sparkles, Globe, ArrowRight, Star, GitFork, Code2 } from "lucide-react";
import type { Metadata } from "next";

// Inline GitHub SVG — lucide-react v1.30 dropped brand icons
function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
    >
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "DevLaunch AI — AI-Powered Developer Career Platform",
  description:
    "Transform your GitHub profile into a stunning portfolio with AI-powered insights, skill analytics, and a recruiter-friendly public page.",
};

const features = [
  {
    icon: Sparkles,
    title: "Developer Insights",
    description:
      "Gemini AI analyzes your repositories and generates professional summaries, skill breakdowns, and career highlights.",
    color: "text-purple-400",
    bg: "bg-purple-400/10",
  },
  {
    icon: Globe,
    title: "Public Portfolio",
    description:
      "Get a beautiful shareable portfolio at devlaunch.ai/username — with hero, projects, skills, and GitHub activity.",
    color: "text-blue-400",
    bg: "bg-blue-400/10",
  },
  {
    icon: Code2,
    title: "Skill Analytics",
    description:
      "Visual breakdown of your strongest technologies, coding trends, and AI-suggested areas to explore next.",
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
  },
];

const stats = [
  { label: "Repositories Analyzed", value: "10K+" },
  { label: "Portfolios Generated", value: "2K+" },
  { label: "Skills Mapped", value: "500+" },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))]">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.8)] backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex items-center justify-center w-7 h-7 rounded-lg animated-border p-0.5">
              <div className="flex items-center justify-center w-full h-full rounded-md bg-[hsl(var(--background))]">
                <Zap className="w-3.5 h-3.5 text-[hsl(var(--primary))]" />
              </div>
            </div>
            <span className="font-bold text-sm gradient-text">DevLaunch AI</span>
          </Link>
          <Link
            href="/login"
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[hsl(var(--primary))] text-white text-sm font-medium hover:bg-[hsl(var(--primary)/0.9)] transition-colors"
          >
            <GitHubIcon className="w-4 h-4" />
            Sign in with GitHub
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Background glows */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-[hsl(var(--primary)/0.08)] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-40 left-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-60 right-1/4 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute inset-0 dot-grid opacity-20" />

        <div className="relative max-w-6xl mx-auto px-6 pt-24 pb-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[hsl(var(--primary)/0.3)] bg-[hsl(var(--primary)/0.08)] text-[hsl(var(--primary))] text-xs font-medium mb-6">
            <Sparkles className="w-3.5 h-3.5" />
            Powered by Google Gemini AI
          </div>

          <h1 className="text-5xl sm:text-6xl font-extrabold tracking-tight leading-[1.1] mb-6">
            Your GitHub is your{" "}
            <span className="gradient-text">career story.</span>
            <br />
            Let AI tell it.
          </h1>

          <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-2xl mx-auto mb-10 leading-relaxed">
            DevLaunch AI transforms your GitHub profile into a professional developer
            portfolio with AI-generated insights, skill analytics, and a stunning
            public page — in minutes.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/login"
              id="hero-cta-btn"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold hover:bg-[hsl(var(--primary)/0.9)] transition-all duration-200 shadow-lg hover:shadow-[hsl(var(--primary)/0.3)] hover:shadow-xl hover:-translate-y-0.5"
            >
              <GitHubIcon className="w-5 h-5" />
              Get Started Free
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="#features"
              className="flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-medium hover:bg-[hsl(var(--accent))] transition-colors"
            >
              See Features
            </Link>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap justify-center gap-8 mt-16">
            {stats.map((s) => (
              <div key={s.label} className="text-center">
                <p className="text-3xl font-bold gradient-text">{s.value}</p>
                <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-6xl mx-auto px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-[hsl(var(--foreground))]">
            Everything you need to land your next role
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] mt-3 max-w-xl mx-auto text-sm">
            From raw GitHub commits to a recruiter-ready career profile — fully automated.
          </p>
        </div>

        <div className="grid sm:grid-cols-3 gap-6">
          {features.map((f) => (
            <div
              key={f.title}
              className="glass-card rounded-2xl p-6 hover:border-[hsl(var(--primary)/0.4)] transition-all duration-300 hover:-translate-y-1 group"
            >
              <div className={`flex items-center justify-center w-10 h-10 rounded-xl ${f.bg} mb-4`}>
                <f.icon className={`w-5 h-5 ${f.color}`} />
              </div>
              <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">{f.title}</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">
                {f.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-6xl mx-auto px-6 py-16 border-t border-[hsl(var(--border))]">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold">How it works</h2>
          <p className="text-[hsl(var(--muted-foreground))] mt-2 text-sm">Three steps to your professional portfolio</p>
        </div>
        <div className="grid sm:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Connect GitHub", desc: "Sign in with GitHub OAuth — we import your public repositories instantly." },
            { step: "02", title: "Generate Insights", desc: "Gemini AI analyzes each repo and produces professional summaries and skill data." },
            { step: "03", title: "Share Portfolio", desc: "Your public portfolio is live at devlaunch.ai/username — ready to send to recruiters." },
          ].map((s) => (
            <div key={s.step} className="relative pl-14">
              <span className="absolute left-0 top-0 text-4xl font-black text-[hsl(var(--primary)/0.15)]">{s.step}</span>
              <h3 className="font-semibold text-[hsl(var(--foreground))] mb-2">{s.title}</h3>
              <p className="text-sm text-[hsl(var(--muted-foreground))] leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-6 py-20 text-center">
        <div className="relative overflow-hidden rounded-3xl border border-[hsl(var(--primary)/0.2)] bg-[hsl(var(--primary)/0.05)] p-12">
          <div className="absolute inset-0 dot-grid opacity-30" />
          <div className="relative">
            <h2 className="text-3xl font-bold mb-3">
              Ready to launch your career?
            </h2>
            <p className="text-[hsl(var(--muted-foreground))] mb-8 max-w-md mx-auto text-sm">
              Join developers who use DevLaunch AI to showcase their skills and stand out to recruiters.
            </p>
            <Link
              href="/login"
              id="bottom-cta-btn"
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold hover:bg-[hsl(var(--primary)/0.9)] transition-all duration-200 shadow-lg hover:-translate-y-0.5"
            >
              <GitHubIcon className="w-5 h-5" />
              Start for Free
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] py-8">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-[hsl(var(--primary))]" />
            <span className="text-sm font-semibold gradient-text">DevLaunch AI</span>
          </div>
          <div className="flex items-center gap-4 text-xs text-[hsl(var(--muted-foreground))]">
            <span className="flex items-center gap-1"><Star className="w-3 h-3" /> Built with Next.js + Gemini</span>
            <span className="flex items-center gap-1"><GitFork className="w-3 h-3" /> Open to contributions</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
