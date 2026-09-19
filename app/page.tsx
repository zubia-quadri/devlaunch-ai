import Link from "next/link";
import { ArrowRight, Check, Sparkles, FileText, Download, GitFork, ArrowUpRight, Terminal, Zap } from "lucide-react";
import type { Metadata } from "next";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { FloatingOrbs } from "@/components/ui/FloatingOrbs";

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
  title: "BuildFolio — Turn what you build into your next opportunity",
  description:
    "Connect your GitHub, paste a job description, and BuildFolio finds the 2–3 projects that best match the role — then turns them into a tailored, ATS-ready resume.",
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[hsl(var(--background))] text-[hsl(var(--foreground))] relative overflow-x-hidden">
      {/* Living Atmospheric Aurora Mesh & Dimensional Starlight Background */}
      <FloatingOrbs />

      {/* Floating Paper Island Navbar */}
      <header className="sticky top-4 z-50 max-w-5xl mx-auto px-4">
        <nav className="flex items-center justify-between px-4 py-2.5 rounded-xl border border-slate-200/80 dark:border-[hsl(var(--border))] bg-white/80 dark:bg-[hsl(var(--card)/0.88)] backdrop-blur-md shadow-sm">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-5 h-5 rounded-[5px] bg-[#81ACEC] flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
              <div className="w-2 h-2 bg-[hsl(var(--background))] rounded-[1px]" />
            </div>
            <div className="flex items-center gap-1">
              <span className="font-semibold text-xs tracking-tight text-[hsl(var(--foreground))]">buildfolio</span>
              <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">/ai</span>
            </div>
          </Link>

          <div className="hidden sm:flex items-center gap-6 text-xs text-[hsl(var(--muted-foreground))]">
            <Link href="#how-it-works" className="hover:text-[hsl(var(--foreground))] transition-colors">How it works</Link>
            <Link href="#features" className="hover:text-[hsl(var(--foreground))] transition-colors">Features</Link>
            <Link href="#preview" className="hover:text-[hsl(var(--foreground))] transition-colors">Examples</Link>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/login"
              className="paper-btn-primary text-xs py-1.5 px-3 rounded-lg shadow-xs flex items-center gap-1.5"
            >
              <GitHubIcon className="w-3.5 h-3.5" />
              <span>build my resume</span>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-5xl mx-auto px-6 pt-16 pb-24 sm:pt-24 sm:pb-32">
        {/* Floating Lively Badges around Hero with Dimensional Glass & Glow */}
        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-emerald-500/30 bg-white/90 dark:bg-card/90 backdrop-blur-md shadow-[0_4px_20px_rgba(16,185,129,0.18)] font-mono text-[11px] text-emerald-600 dark:text-emerald-400 absolute left-2 top-28 animate-float select-none">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shadow-[0_0_8px_#10b981]" />
          <span>3 PROJECTS MATCHED</span>
        </div>

        <div className="hidden lg:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-500/35 bg-white/90 dark:bg-card/90 backdrop-blur-md shadow-[0_4px_20px_rgba(99,102,241,0.18)] font-mono text-[11px] text-indigo-600 dark:text-[#81ACEC] absolute right-2 top-36 animate-float-delayed select-none">
          <Sparkles className="w-3.5 h-3.5 text-indigo-500 dark:text-[#81ACEC]" />
          <span>AI ROLE MATCHING</span>
        </div>

        <div className="hidden md:flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-violet-500/35 bg-white/90 dark:bg-card/90 backdrop-blur-md shadow-[0_4px_20px_rgba(139,92,246,0.18)] font-mono text-[11px] text-violet-600 dark:text-violet-400 absolute left-6 bottom-40 animate-float select-none">
          <Terminal className="w-3.5 h-3.5 text-violet-500 dark:text-violet-400" />
          <span>TAILORED ATS RESUME</span>
        </div>

        {/* Technical Status Pill */}
        <div className="flex justify-center mb-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border border-indigo-500/25 bg-indigo-500/10 dark:bg-[#81ACEC]/15 font-mono text-[11px] text-indigo-700 dark:text-[#81ACEC] shadow-[0_0_15px_rgba(99,102,241,0.15)]">
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 dark:bg-[#81ACEC] animate-pulse" />
            <span>buildfolio // github → role → resume</span>
          </div>
        </div>

        {/* Hero Title & Subtitle with Vibrant Gradient Dimensions */}
        <div className="text-center max-w-3xl mx-auto space-y-5">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.08] text-[hsl(var(--foreground))]">
            your best projects are already on github.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 dark:from-blue-400 dark:via-indigo-300 dark:to-violet-400 bg-clip-text text-transparent font-bold">
              we turn them into the right resume.
            </span>
          </h1>

          <p className="text-sm sm:text-base text-[hsl(var(--muted-foreground))] max-w-xl mx-auto leading-relaxed">
            Connect your GitHub, paste a job description, and BuildFolio finds the 2–3 projects that best match the role — then turns them into a tailored, ATS-ready resume.
          </p>

          {/* Action CTAs with Depth & Vibrancy */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-3">
            <Link
              href="/login"
              className="w-full sm:w-auto text-xs py-3 px-6 rounded-xl font-medium text-white bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 hover:from-blue-500 hover:via-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-500/25 hover:shadow-lg hover:shadow-indigo-500/40 hover:-translate-y-0.5 transition-all flex items-center justify-center gap-2"
            >
              <span>build my resume free</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <Link
              href="#how-it-works"
              className="w-full sm:w-auto text-xs py-3 px-5 rounded-xl font-medium border border-slate-300 dark:border-slate-800 bg-white/80 dark:bg-card/80 backdrop-blur-md text-slate-800 dark:text-slate-200 hover:border-indigo-400 hover:bg-slate-50 dark:hover:bg-slate-900 shadow-sm transition-all flex items-center justify-center gap-2"
            >
              <span>see how it works</span>
              <ArrowUpRight className="w-3.5 h-3.5 opacity-60" />
            </Link>
          </div>
        </div>

        {/* Conceptual Value Proposition Flow Card */}
        <div className="mt-14 max-w-4xl mx-auto">
          <div className="card-3d p-6 sm:p-7 border border-[hsl(var(--border))] space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[hsl(var(--border)/0.6)] pb-4">
              <div>
                <span className="paper-tag paper-tag-blue text-[10px]">WHY BUILDFOLIO</span>
                <h2 className="text-base sm:text-lg font-semibold text-[hsl(var(--foreground))] mt-1">
                  Not every project belongs on every resume.
                </h2>
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))] max-w-md leading-relaxed sm:text-right">
                You might have 15+ repositories, but only 2–3 actually strengthen your application for a specific role. BuildFolio finds them.
              </p>
            </div>

            {/* Conceptual Pipeline Visualization */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-1 font-mono text-[11px] items-center text-center">
              <div className="p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <p className="text-[9px] text-[hsl(var(--muted-foreground))] uppercase">your github</p>
                <p className="font-semibold text-[hsl(var(--foreground))] mt-0.5">15+ projects</p>
              </div>
              <div className="hidden sm:flex justify-center text-[hsl(var(--muted-foreground))] text-xs font-bold">→</div>
              <div className="p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
                <p className="text-[9px] text-[hsl(var(--muted-foreground))] uppercase">target role</p>
                <p className="font-semibold text-[hsl(var(--foreground))] mt-0.5">job description</p>
              </div>
              <div className="hidden sm:flex justify-center text-[hsl(var(--muted-foreground))] text-xs font-bold">→</div>
              <div className="col-span-2 sm:col-span-1 p-3 rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-700 dark:text-indigo-400">
                <p className="text-[9px] uppercase font-bold">buildfolio match</p>
                <p className="font-semibold mt-0.5">2–3 right projects</p>
              </div>
            </div>
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
                <span className="paper-tag paper-tag-blue text-[10px]">3 projects matched</span>
              </div>
            </div>

            {/* Canvas Work Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 min-h-[460px]">
              {/* Left Column: Job Description & Matched Repos */}
              <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-[hsl(var(--border))] bg-[hsl(var(--background)/0.5)] space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[11px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">job description</span>
                  <span className="font-mono text-[10px] text-[hsl(var(--muted-foreground))]">1,017 chars</span>
                </div>

                <div className="p-3 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] font-mono text-xs text-[hsl(var(--muted-foreground))] space-y-2">
                  <div className="text-[hsl(var(--foreground))] font-semibold">Full Stack Developer — Google</div>
                  <p className="line-clamp-5 leading-relaxed text-[11px]">
                    Seeking a motivated Full Stack Developer to build scalable web apps across React, Node.js, and cloud databases. Deliver high-performance RESTful APIs, maintain CI/CD pipelines, and collaborate with product teams.
                  </p>
                </div>

                <div className="space-y-2 pt-2">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[11px] uppercase tracking-wider text-[hsl(var(--muted-foreground))]">matched repositories</span>
                    <span className="font-mono text-[9px] text-[#4a77bf] dark:text-[#9ec2f7]">AI-selected for this role</span>
                  </div>
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

              {/* Right Column: Tailored Resume Sheet */}
              <div className="lg:col-span-7 p-6 flex flex-col items-center justify-center bg-[hsl(var(--muted)/0.25)] paper-grid-dense">
                <div className="w-full max-w-md mb-2 flex items-center justify-between">
                  <span className="paper-tag paper-tag-blue text-[10px]">TAILORED RESUME</span>
                  <span className="font-mono text-[9px] text-[hsl(var(--muted-foreground))] uppercase">ATS-READY OUTPUT</span>
                </div>
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
              <h2 className="text-xl font-semibold tracking-tight text-[hsl(var(--foreground))] mt-1">
                how BuildFolio works
              </h2>
            </div>
            <span className="font-mono text-xs text-[hsl(var(--muted-foreground))]">03 stages</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              {
                step: "[01]",
                title: "01 — connect & understand",
                desc: "Connect GitHub and let BuildFolio analyze your repositories, technologies, languages, and project details to understand what you've built.",
              },
              {
                step: "[02]",
                title: "02 — match the role",
                desc: "Paste any job description. BuildFolio compares the role requirements with your repositories and identifies the 2–3 projects that best demonstrate your fit.",
              },
              {
                step: "[03]",
                title: "03 — build your resume",
                desc: "Your selected projects become tailored resume content with relevant, achievement-focused bullets that you can download and submit.",
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
              <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">understand what you've built</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                Go beyond basic GitHub language labels. BuildFolio analyzes your repositories to understand frameworks, libraries, databases, tooling, and the technologies behind your projects.
              </p>
            </div>

            <div className="card-3d p-6 space-y-3 hover:-translate-y-1.5 transition-all duration-200">
              <span className="paper-tag paper-tag-blue">your developer profile</span>
              <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">showcase your work beyond the resume</h3>
              <p className="text-xs text-[hsl(var(--muted-foreground))] leading-relaxed">
                Turn your GitHub work into a polished developer profile you can share with recruiters, hiring teams, and collaborators.
              </p>
            </div>
          </div>
        </section>

        {/* Bottom CTA Banner */}
        <section className="mt-20 p-8 sm:p-12 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-center space-y-4">
          <div className="w-8 h-8 rounded-lg bg-[#81ACEC] mx-auto flex items-center justify-center">
            <div className="w-3 h-3 bg-[hsl(var(--background))] rounded-[1.5px]" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-[hsl(var(--foreground))]">
            ready to build your next application?
          </h2>
          <p className="text-xs sm:text-sm text-[hsl(var(--muted-foreground))] max-w-md mx-auto">
            Connect your GitHub, add a job description, and let BuildFolio find the projects that matter.
          </p>
          <div className="pt-2">
            <Link
              href="/login"
              className="paper-btn-primary text-xs py-2.5 px-6 rounded-lg shadow-sm hover:shadow-[0_0_20px_rgba(129,172,236,0.3)]"
            >
              <span>build my resume free</span>
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
            <span className="font-semibold text-slate-800 dark:text-slate-200">BuildFolio</span>
          </div>
          <div className="flex items-center gap-6">
            <span>turn what you build into your next opportunity</span>
            <span>next.js · prisma · gemini</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
