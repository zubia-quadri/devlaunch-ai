import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const metadata: Metadata = {
  title: "Settings — BuildFolio",
  description: "Manage your profile and portfolio settings.",
};

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const userId = session.user.id;

  const [user, portfolio, repos] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true, name: true, email: true, image: true,
        bio: true, location: true, website: true,
        twitterHandle: true, linkedinUrl: true, githubUsername: true,
        phone: true, education: true, certifications: true, achievements: true, currentRole: true,
      },
    }),
    prisma.portfolio.findUnique({ where: { userId } }),
    prisma.repository.findMany({
      where: { userId, isFork: false },
      orderBy: { stars: "desc" },
      select: { id: true, name: true, language: true, stars: true },
      take: 30,
    }),
  ]);

  if (!user) redirect("/login");

  const portfolioUsername = portfolio?.username ?? user.githubUsername ?? userId;

  return (
    <div className="p-4 sm:p-8 space-y-7 max-w-4xl mx-auto w-full">
      {/* ── 3D Futuristic HUD Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card)/0.65)] backdrop-blur-md shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-72 h-20 bg-[#81ACEC]/15 blur-3xl pointer-events-none" />

        <div className="space-y-1 relative z-10">
          <div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
            <span className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/25">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              USER.CONFIG // SECURE
            </span>
            <span>//</span>
            <span className="text-[hsl(var(--foreground))]">PREFERENCES</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-normal tracking-tight text-[hsl(var(--foreground))] pt-0.5">
            profile &amp; portfolio settings
          </h1>
          <p className="font-mono text-xs text-[hsl(var(--muted-foreground))]">
            manage your resume contact info, career highlights, and live portfolio showcase
          </p>
        </div>

        {portfolio?.isPublic && (
          <Link
            href={`/${portfolioUsername}`}
            target="_blank"
            className="paper-btn-secondary text-xs py-2 px-3.5 rounded-xl hover:border-[#81ACEC] transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs relative z-10"
          >
            <ExternalLink className="w-3.5 h-3.5 text-[#81ACEC]" />
            <span>view live portfolio</span>
          </Link>
        )}
      </div>

      <SettingsClient
        profile={{
          name: user.name, bio: user.bio, location: user.location,
          website: user.website, twitterHandle: user.twitterHandle,
          linkedinUrl: user.linkedinUrl, email: user.email,
          image: user.image, githubUsername: user.githubUsername,
          phone: user.phone, education: user.education,
          certifications: user.certifications, achievements: user.achievements,
          currentRole: user.currentRole,
        }}
        portfolio={{
          headline: portfolio?.headline ?? null,
          bio: portfolio?.bio ?? null,
          email: portfolio?.email ?? null,
          linkedinUrl: portfolio?.linkedinUrl ?? null,
          twitterHandle: portfolio?.twitterHandle ?? null,
          websiteUrl: portfolio?.websiteUrl ?? null,
          isPublic: portfolio?.isPublic ?? true,
          showEmail: portfolio?.showEmail ?? false,
          showActivity: portfolio?.showActivity ?? true,
          featuredRepoIds: (portfolio?.featuredRepoIds as string[]) ?? [],
          username: portfolioUsername,
        }}
        repos={repos}
      />
    </div>
  );
}
