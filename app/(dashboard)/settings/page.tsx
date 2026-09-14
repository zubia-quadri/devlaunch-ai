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
    <div className="p-4 sm:p-8 space-y-6 max-w-3xl mx-auto w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] text-[hsl(var(--muted-foreground))]">
            <span>workspace</span>
            <span>/</span>
            <span className="text-[hsl(var(--foreground))]">settings</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-[hsl(var(--foreground))] mt-0.5">
            profile &amp; portfolio settings
          </h1>
          <p className="font-mono text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
            configure your resume contact info, bio, and live showcase
          </p>
        </div>
        {portfolio?.isPublic && (
          <Link
            href={`/${portfolioUsername}`}
            target="_blank"
            className="paper-btn-secondary text-xs py-1.5 px-3 rounded-lg self-start sm:self-auto"
          >
            <ExternalLink className="w-3.5 h-3.5 opacity-60" />
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
