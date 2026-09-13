import type { Metadata } from "next";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { SettingsClient } from "@/components/settings/SettingsClient";

export const metadata: Metadata = {
  title: "Settings — DevLaunch AI",
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
        phone: true, education: true, currentRole: true,
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
    <div className="p-6 space-y-6 max-w-3xl">
      {/* Header */}
      <div className="flex items-end justify-between gap-4 flex-wrap animate-fade-in-up">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-[hsl(var(--primary))] animate-pulse-glow" />
            <span className="text-xs font-semibold uppercase tracking-widest text-[hsl(var(--muted-foreground))]">
              Account
            </span>
          </div>
          <h1 className="text-3xl font-bold text-[hsl(var(--foreground))]">Settings</h1>
          <p className="text-sm text-[hsl(var(--muted-foreground))] mt-1">
            Manage your profile and public portfolio
          </p>
        </div>
        {portfolio?.isPublic && (
          <Link
            href={`/${portfolioUsername}`}
            target="_blank"
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-emerald-500/25 bg-emerald-500/8 text-emerald-400 text-xs font-semibold hover:bg-emerald-500/15 transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            View Live Portfolio
          </Link>
        )}
      </div>

      <SettingsClient
        profile={{
          name: user.name, bio: user.bio, location: user.location,
          website: user.website, twitterHandle: user.twitterHandle,
          linkedinUrl: user.linkedinUrl, email: user.email,
          image: user.image, githubUsername: user.githubUsername,
          phone: user.phone, education: user.education, currentRole: user.currentRole,
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
