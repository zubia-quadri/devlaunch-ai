import Link from "next/link";
import { ArrowRight, Check, Sparkles, FileText, Download, GitFork, ArrowUpRight, Terminal, Zap } from "lucide-react";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { StarFieldBackground } from "@/components/ui/StarFieldBackground";

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
  title: "buildFolio — the connected resume workspace for engineers",
  description:
    "Paste any job description. AI scans your GitHub projects, picks the best matches, and compiles a tailored resume ready to download.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] relative overflow-x-hidden">
      {/* Living AuthKit-style Moving Starfield Background (Dynamic in Light/Dark mode) */}
      <StarFieldBackground />

      {/* Floating Paper Island Navbar */}
      <header className="sticky top-4 z-50 max-w-5xl mx-auto px-4">
        <nav className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.88)] backdrop-blur-md shadow-xs">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-5 h-5 rounded-[5px] bg-[#81ACEC] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <div className="w-2 h-2 bg-[hsl(var(--background))] rounded-[1px]" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-xs tracking-tight text-[hsl(var(--foreground))]">buildFolio</span>
              <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">/ai</span>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-xs text-[hsl(var(--muted-foreground))]">
            <Link href="#how-it-works" className="hover:text-[hsl(var(--foreground))] transition-colors">how it works</Link>
            <Link href="#features" className="hover:text-[hsl(var(--foreground))] transition-colors">features</Link>
            <Link href="#preview" className="hover:text-[hsl(var(--foreground))] transition-colors">draft canvas</Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="paper-btn-primary text-xs py-1.5 px-3 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              <span>sign in</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Floating Lively Badges around Hero */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-[hsl(var(--card)/0.9)] backdrop-blur-md shadow-lg font-mono text-[11px] text-emerald-500 absolute left-2 top-28 animate-float select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_#34d399]" />
          <span>ATS MATCH: 98%</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#81ACEC]/35 bg-[hsl(var(--card)/0.9)] backdrop-blur-md shadow-lg font-mono text-[11px] text-[#81ACEC] absolute right-2 top-36 animate-float-delayed select-none">
          <Sparkles className="w-3.5 h-3.5 text-[#81ACEC]" />
          <span>GEMINI 2.5 FLASH</span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/35 bg-[hsl(var(--card)/0.9)] backdrop-blur-md shadow-lg font-mono text-[11px] text-violet-400 absolute left-6 bottom-40 animate-float select-none">
          <Terminal className="w-3.5 h-3.5 text-violet-400" />
          <span>3 REPOS SELECTED</span>
        </div>

        {/* Technical Status Pill */}
        <div className="flex justify-center mb-6">
          <div className="paper-tag paper-tag-blue shadow-[0_0_12px_rgba(129,172,236,0.2)]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#81ACEC] animate-pulse" />
            <span>paper studio edition v2.5 // starlight canvas active</span>
          </div>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-normal tracking-tight leading-[1.08] text-[hsl(var(--foreground))]">
            your github is your resume.
            <br />
            <span className="text-[hsl(var(--muted-foreground))]">
              tailored for every role.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] max-w-xl mx-auto leading-relaxed">
            paste any job description. buildFolio analyzes your repositories, selects the 2–3 most relevant projects, and formats an ats-optimized pdf in seconds.
          </p>

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/login"
              className="paper-btn-primary w-full sm:w-auto text-xs py-2.5 px-5 rounded-lg shadow-sm hover:shadow-[0_0_20px_rgba(129,172,236,0.3)] transition-all"
            >
              <span>build my resume free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>

            <Link
              href="#preview"
              className="paper-btn-secondary w-full sm:w-auto text-xs py-2.5 px-4 rounded-lg hover:border-[#81ACEC] transition-colors"
            >
              <span>explore drafting canvas</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>
        </div>

        {/* Studio Canvas Preview Mockup */}
        <section id="preview" className="mt-16 sm:mt-20 perspective-1200">
          <div className="rounded-2xl border border-[#81ACEC]/30 bg-[hsl(var(--card))] overflow-hidden shadow-[0_20px_50px_-15px_rgba(0,0,0,0.5),0_0_30px_-5px_rgba(129,172,236,0.2)] relative transition-all duration-300 hover:border-[#81ACEC]/60 hover:shadow-[0_25px_60px_-15px_rgba(0,0,0,0.7),0_0_40px_-5px_rgba(129,172,236,0.35)]">
            {/* Animated glowing perimeter laser sweep */}
            <div className="absolute -top-[1px] left-0 w-full h-[2px] overflow-hidden pointer-events-none">
              <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-[#81ACEC] to-transparent animate-grid-beam-x" />
            </div>

            {/* Top Chrome Window Bar */}
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)]">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                <span className="ml-2 font-mono text-[11px] text-[hsl(var(--muted-foreground))]">workspace / resume-builder</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="paper-tag paper-tag-blue text-[10px]">ats match: 94%</span>
              </div>
            </div>

            {/* Canvas Work Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
              {/* Left Column: Spec Sheet */}
              <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-[hsl(var(--border))] bg-[hsl(var(--background)/0.5)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">job specification</span>
                  <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">1,017 chars</span>
                </div>

                <div className="p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] font-mono text-xs text-[hsl(var(--muted-foreground))] space-y-2">
                  <div className="text-[hsl(var(--foreground))] font-semibold">Full Stack Developer — Google</div>
                  <p className="line-clamp-5 leading-relaxed text-[11px]">
                    Seeking a motivated Full Stack Developer to build scalable web apps across React, Node.js, and cloud databases. Deliver high-performance RESTful APIs, maintain CI/CD pipelines, and collaborate with product teams.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">matched repositories</span>
                  <div className="space-y-1.5">
                    {[
                      { name: "web-vulnerability-scanner", tag: "Next.js · React · Node.js", match: "#1 match" },
                      { name: "eco-buy", tag: "Express · REST APIs · HTML5", match: "#2 match" },
                      { name: "mobile-security-scanner", tag: "SAST · CI/CD · Security", match: "#3 match" },
                    ].map((r) => (
                      <div key={r.name} className="flex items-center justify-between p-2 rounded-md border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-xs">
                        <div>
                          <p className="font-medium text-[hsl(var(--foreground))]">{r.name}</p>
                          <p className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">{r.tag}</p>
                        </div>
                        <span className="font-mono text-[9px] text-[#4a77bf] dark:text-[#9ec2f7]">{r.match}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Physical Paper Resume Sheet */}
              <div className="lg:col-span-7 p-6 flex items-center justify-center bg-[hsl(var(--muted)/0.25)] paper-grid-dense">
                <div className="paper-sheet w-full max-w-md p-6 rounded-md font-serif text-neutral-900">
                  {/* Resume Header */}
                  <div className="border-b border-neutral-300 pb-3 mb-3">
                    <h2 className="text-base font-bold tracking-tight text-neutral-900">Zubiya Quadri</h2>
                    <p className="text-[11px] text-neutral-600 font-sans mt-0.5">Full Stack Developer · github.com/zubia-quadri</p>
                  </div>

                  {/* Summary */}
                  <div className="mb-3">
                    <p className="font-sans text-[9px] uppercase font-bold tracking-wider text-neutral-500 mb-1">Summary</p>
                    <p className="text-[10px] text-neutral-700 leading-relaxed font-sans">
                      Versatile Full Stack Developer with hands-on experience designing and deploying scalable web applications across modern JavaScript frameworks, robust Node.js backends, and cloud infrastructure.
                    </p>
                  </div>

                  {/* Projects */}
                  <div className="mb-3">
                    <p className="font-sans text-[9px] uppercase font-bold tracking-wider text-neutral-500 mb-1">Selected Projects</p>
                    <div className="space-y-1.5 font-sans">
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-neutral-900">
                          <span>web-vulnerability-scanner</span>
                          <span className="font-normal text-neutral-500 text-[9px]">Next.js · Node.js</span>
                        </div>
                        <p className="text-[9px] text-neutral-600 leading-snug">
                          • Engineered automated vulnerability scanner UI with real-time port and SSL diagnostics.
                        </p>
                      </div>
                      <div>
                        <div className="flex justify-between text-[10px] font-bold text-neutral-900">
                          <span>eco-buy</span>
                          <span className="font-normal text-neutral-500 text-[9px]">Express · REST APIs</span>
                        </div>
                        <p className="text-[9px] text-neutral-600 leading-snug">
                          • Built customizable storefront platform for sustainable goods with modular inventory controls.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  <div>
                    <p className="font-sans text-[9px] uppercase font-bold tracking-wider text-neutral-500 mb-1">Core Competencies</p>
                    <p className="text-[9px] text-neutral-700 font-sans">
                      React · Next.js · Node.js · Express · REST APIs · Tailwind CSS · CI/CD · Security
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3-Step Architectural Grid */}
        <section id="how-it-works" className="mt-24 pt-12 border-t border-[hsl(var(--border))]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <p className="font-mono text-[10px] uppercase tracking-widest text-[#81ACEC]">system overview</p>
              <h2 className="text-xl font-medium tracking-tight text-[hsl(var(--foreground))] mt-1">
                how the paper compiler works
              </h2>
            </div>
            <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">03 stages</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "[01]",
                title: "import & index",
                desc: "sign in with github. buildFolio pulls your public repositories, commits, and languages into your private studio index.",
              },
              {
                step: "[02]",
                title: "semantic match",
                desc: "drop in any job description. gemini ai evaluates role requirements against your code history to pinpoint your top 2-3 projects.",
              },
              {
                step: "[03]",
                title: "compile & download",
                desc: "generate a clean, ats-compliant pdf with quantified achievement bullets ready to submit in one click.",
              },
            ].map((f) => (
              <div
                key={f.step}
                className="card-3d p-6 space-y-2 hover:-translate-y-1.5 transition-all duration-200 group"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-[#81ACEC] font-semibold">{f.step}</span>
                  <div className="w-1.5 h-1.5 rounded-full bg-[#81ACEC]/50 group-hover:bg-[#81ACEC] group-hover:shadow-[0_0_8px_#81ACEC] transition-colors" />
                </div>
                <h3 className="text-sm font-semibold text-[hsl(var(--foreground))] group-hover:text-[#81ACEC] transition-colors">{f.title}</h3>
                <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Feature Grid */}
        <section id="features" className="mt-16 pt-12 border-t border-[hsl(var(--border))]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="card-3d p-6 space-y-3 hover:-translate-y-1.5 transition-all duration-200">
              <span className="paper-tag paper-tag-blue">developer insights</span>
              <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">automatic tech stack discovery</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                go beyond basic github language labels. ai parses repository architectures to detect frameworks, libraries, sast tooling, and databases.
              </p>
            </div>

            <div className="card-3d p-6 space-y-3 hover:-translate-y-1.5 transition-all duration-200">
              <span className="paper-tag paper-tag-blue">shareable portfolio</span>
              <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">live public showcase</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                every member gets an executive public portfolio URL at buildfolio.me/username to share directly with founders and hiring teams.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="mt-20 p-8 sm:p-12 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-center space-y-4">
          <div className="w-8 h-8 rounded-lg bg-[#81ACEC] mx-auto flex items-center justify-center">
            <div className="w-3 h-3 bg-[hsl(var(--background))] rounded-[1.5px]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-normal tracking-tight text-[hsl(var(--foreground))]">
            ready to ship your next career move?
          </h2>
          <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] max-w-md mx-auto">
            connect your github in seconds. generate tailored resumes for every application.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="paper-btn-primary text-xs py-2.5 px-6 rounded-lg"
            >
              <span>get started for free</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-[hsl(var(--border))] py-8 px-6">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 font-mono text-[11px] text-[hsl(var(--muted-foreground))]">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded-[3px] bg-[#81ACEC]" />
            <span>buildFolio studio</span>
          </div>
          <div className="flex items-center gap-6">
            <span>built on web standards</span>
            <span>next.js · prisma · gemini</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
