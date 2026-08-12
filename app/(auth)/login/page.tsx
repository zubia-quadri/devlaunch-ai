import { signIn } from "@/lib/auth";
import { Zap } from "lucide-react";
import type { Metadata } from "next";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

export const metadata: Metadata = {
  title: "Sign In — DevLaunch AI",
  description: "Sign in to DevLaunch AI with your GitHub account",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-[hsl(var(--background))] dot-grid overflow-hidden">

      {/* Animated background orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-[hsl(var(--primary)/0.08)] rounded-full blur-3xl pointer-events-none animate-float-slower" />
      <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/6 rounded-full blur-3xl pointer-events-none animate-float-slow" style={{ animationDelay: "3s" }} />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[200px] bg-cyan-500/4 rounded-full blur-3xl pointer-events-none animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="relative w-full max-w-sm mx-4 animate-fade-in-up">

        {/* Card */}
        <div className="glass-card rounded-2xl p-8 shadow-2xl shadow-[hsl(var(--primary)/0.1)] glow-border">

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <div className="flex items-center justify-center w-14 h-14 rounded-2xl animated-border p-0.5 mb-4 animate-pulse-glow">
              <div className="flex items-center justify-center w-full h-full rounded-xl bg-[hsl(var(--card))]">
                <Zap className="w-7 h-7 text-[hsl(var(--primary))]" />
              </div>
            </div>
            <h1 className="text-2xl font-bold gradient-text">DevLaunch AI</h1>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1 text-center">
              AI-powered Developer Career Platform
            </p>
          </div>

          {/* Heading */}
          <div className="text-center mb-6">
            <h2 className="text-lg font-semibold text-[hsl(var(--foreground))]">
              Welcome back
            </h2>
            <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
              Sign in with GitHub to access your career hub
            </p>
          </div>

          {/* GitHub sign-in */}
          <form
            action={async () => {
              "use server";
              await signIn("github", { redirectTo: "/dashboard" });
            }}
          >
            <button
              id="github-signin-btn"
              type="submit"
              className="flex items-center justify-center gap-3 w-full py-3 px-4 rounded-xl bg-[hsl(var(--foreground))] text-[hsl(var(--background))] text-sm font-semibold hover:opacity-90 active:scale-[0.98] transition-all duration-200 shadow-lg btn-magnetic"
            >
              <GitHubIcon className="w-5 h-5" />
              Continue with GitHub
            </button>
          </form>

          {/* Divider */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[hsl(var(--border))]" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[hsl(var(--card))] px-3 text-[10px] text-[hsl(var(--muted-foreground))]">
                what you get
              </span>
            </div>
          </div>

          {/* Mini feature pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {["AI project summaries", "Skill proficiency scores", "Shareable portfolio link", "Recruiter-ready"].map((feat, i) => (
              <span
                key={feat}
                className="text-[10px] px-2.5 py-1 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--accent)/0.5)] text-[hsl(var(--muted-foreground))] animate-fade-in-up"
                style={{ animationDelay: `${200 + i * 60}ms` }}
              >
                {feat}
              </span>
            ))}
          </div>

          {/* Footer note */}
          <p className="text-center text-[10px] text-[hsl(var(--muted-foreground))] mt-5 leading-relaxed">
            We only request access to your public repositories.
          </p>
        </div>

        {/* Floating stat badges */}
        <div className="mt-5 grid grid-cols-3 gap-3 text-center">
          {[
            { label: "AI Insights", desc: "Powered by Gemini" },
            { label: "Public Portfolio", desc: "Share instantly" },
            { label: "Skill Analytics", desc: "Career clarity" },
          ].map((f, i) => (
            <div
              key={f.label}
              className="rounded-xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.6)] backdrop-blur-sm p-3 card-hover animate-fade-in-up"
              style={{ animationDelay: `${350 + i * 75}ms` }}
            >
              <p className="text-xs font-semibold text-[hsl(var(--foreground))]">{f.label}</p>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
