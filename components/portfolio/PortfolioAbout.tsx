import { MapPin, Globe } from "lucide-react";

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.259 5.631 5.905-5.631Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

interface PortfolioAboutProps {
  bio: string | null;
  location: string | null;
  website: string | null;
  twitterHandle: string | null;
  linkedinUrl: string | null;
}

export function PortfolioAbout({
  bio,
  location,
  website,
  twitterHandle,
  linkedinUrl,
}: PortfolioAboutProps) {
  if (!bio && !location && !website && !twitterHandle && !linkedinUrl) return null;

  return (
    <section id="about" className="py-16 px-6 border-t border-[hsl(var(--border))]">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>About</SectionLabel>

        <div className="mt-6 grid md:grid-cols-3 gap-8">
          {/* Bio */}
          <div className="md:col-span-2">
            {bio ? (
              <p className="text-[hsl(var(--foreground)/0.85)] leading-relaxed text-base">
                {bio}
              </p>
            ) : (
              <p className="text-[hsl(var(--muted-foreground))] italic text-sm">
                No bio added yet.
              </p>
            )}
          </div>

          {/* Links sidebar */}
          <div className="space-y-3">
            {location && (
              <Link icon={MapPin} label={location} />
            )}
            {website && (
              <a
                href={website}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-[hsl(var(--foreground)/0.8)] hover:text-[hsl(var(--primary))] transition-colors"
              >
                <Globe className="w-4 h-4 text-[hsl(var(--primary))] shrink-0" />
                {website.replace(/^https?:\/\//, "")}
              </a>
            )}
            {twitterHandle && (
              <a
                href={`https://twitter.com/${twitterHandle}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-[hsl(var(--foreground)/0.8)] hover:text-[hsl(var(--primary))] transition-colors"
              >
                <TwitterIcon className="w-4 h-4 text-sky-400 shrink-0" />
                @{twitterHandle}
              </a>
            )}
            {linkedinUrl && (
              <a
                href={linkedinUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2.5 text-sm text-[hsl(var(--foreground)/0.8)] hover:text-[hsl(var(--primary))] transition-colors"
              >
                <LinkedinIcon className="w-4 h-4 text-sky-600 shrink-0" />
                LinkedIn
              </a>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function Link({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2.5 text-sm text-[hsl(var(--muted-foreground))]">
      <Icon className="w-4 h-4 shrink-0" />
      {label}
    </div>
  );
}

export function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <h2 className="text-xs font-bold text-[hsl(var(--primary))] uppercase tracking-widest">
        {children}
      </h2>
      <div className="flex-1 h-px bg-[hsl(var(--border))]" />
    </div>
  );
}
