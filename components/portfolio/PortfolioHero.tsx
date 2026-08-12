import { Star, GitFork, Code2, MapPin, Globe, Mail } from "lucide-react";

interface PortfolioHeroProps {
  name: string | null;
  headline: string | null;
  image: string | null;
  githubUsername: string;
  location: string | null;
  website: string | null;
  email: string | null;
  showEmail: boolean;
  totalRepos: number;
  totalStars: number;
  totalForks: number;
}

export function PortfolioHero({
  name,
  headline,
  image,
  githubUsername,
  location,
  website,
  email,
  showEmail,
  totalRepos,
  totalStars,
  totalForks,
}: PortfolioHeroProps) {
  return (
    <section className="relative overflow-hidden py-24 px-6">
      {/* Ambient background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-[hsl(var(--primary)/0.08)] blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 rounded-full bg-violet-500/6 blur-3xl" />
      </div>

      <div className="max-w-5xl mx-auto flex flex-col items-center text-center gap-6">
        {/* Avatar */}
        {image && (
          <div className="relative">
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-[hsl(var(--primary))] to-violet-600 blur-md opacity-30 scale-110" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={image}
              alt={name ?? githubUsername}
              className="relative w-28 h-28 rounded-full border-4 border-[hsl(var(--background))] shadow-xl"
            />
          </div>
        )}

        {/* Name + headline */}
        <div className="space-y-2">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">
            {name ?? githubUsername}
          </h1>
          {headline && (
            <p className="text-lg text-[hsl(var(--muted-foreground))] max-w-xl">
              {headline}
            </p>
          )}
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap justify-center gap-4 text-sm text-[hsl(var(--muted-foreground))]">
          {location && (
            <span className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4" />
              {location}
            </span>
          )}
          {website && (
            <a
              href={website}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 hover:text-[hsl(var(--primary))] transition-colors"
            >
              <Globe className="w-4 h-4" />
              {website.replace(/^https?:\/\//, "")}
            </a>
          )}
          {showEmail && email && (
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 hover:text-[hsl(var(--primary))] transition-colors"
            >
              <Mail className="w-4 h-4" />
              {email}
            </a>
          )}
        </div>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-6">
          {[
            { icon: Code2, value: totalRepos, label: "Repos" },
            { icon: Star,   value: totalStars, label: "Stars" },
            { icon: GitFork, value: totalForks, label: "Forks" },
          ].map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col items-center gap-1">
              <div className="flex items-center gap-1.5 text-2xl font-bold text-[hsl(var(--foreground))]">
                <Icon className="w-5 h-5 text-[hsl(var(--primary))]" />
                {value.toLocaleString()}
              </div>
              <p className="text-xs text-[hsl(var(--muted-foreground))]">{label}</p>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div className="flex flex-wrap justify-center gap-3 mt-2">
          <a
            href={`https://github.com/${githubUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[hsl(var(--primary))] text-white font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-[hsl(var(--primary)/0.25)]"
          >
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
            </svg>
            GitHub Profile
          </a>
          <a
            href="#contact"
            onClick={(e) => {
              e.preventDefault();
              document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
            }}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[hsl(var(--border))] text-[hsl(var(--foreground))] font-semibold text-sm hover:bg-[hsl(var(--accent))] transition-colors"
          >
            <Mail className="w-4 h-4" />
            Get in Touch
          </a>
        </div>
      </div>
    </section>
  );
}
