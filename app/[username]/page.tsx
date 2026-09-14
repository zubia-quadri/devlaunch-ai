import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatMonth } from "@/lib/utils";
import { PortfolioNav } from "@/components/portfolio/PortfolioNav";
import { PortfolioHero } from "@/components/portfolio/PortfolioHero";
import { PortfolioAbout } from "@/components/portfolio/PortfolioAbout";
import { FeaturedProjects } from "@/components/portfolio/FeaturedProjects";
import { SkillsSection } from "@/components/portfolio/SkillsSection";
import { CareerHighlights } from "@/components/portfolio/CareerHighlights";
import { ActivitySection } from "@/components/portfolio/ActivitySection";
import { ContactSection } from "@/components/portfolio/ContactSection";

// Allow dynamic metadata per user
export async function generateMetadata({
  params,
}: {
  params: Promise<{ username: string }>;
}): Promise<Metadata> {
  const { username } = await params;
  const portfolio = await prisma.portfolio.findUnique({
    where: { username },
    include: { user: { select: { name: true, image: true } } },
  });

  if (!portfolio || !portfolio.isPublic) {
    return {
      title: "Portfolio Not Found — DevLaunch AI",
      robots: { index: false, follow: false },
    };
  }

  const name = portfolio.user.name ?? username;
  const title = `${name} — Developer Portfolio`;
  const description =
    portfolio.headline ??
    portfolio.bio?.slice(0, 160) ??
    `${name}'s developer portfolio on DevLaunch AI`;
  const avatarUrl = portfolio.user.image ?? undefined;
  const appUrl = process.env.AUTH_URL ?? "https://devlaunch.ai";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: "profile",
      url: `${appUrl}/${username}`,
      siteName: "DevLaunch AI",
      ...(avatarUrl ? { images: [{ url: avatarUrl, width: 400, height: 400, alt: name }] } : {}),
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      ...(avatarUrl ? { images: [avatarUrl] } : {}),
    },
    robots: { index: true, follow: true },
    alternates: { canonical: `${appUrl}/${username}` },
  };
}


export default async function PublicPortfolioPage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const portfolio = await prisma.portfolio.findUnique({
    where: { username },
    include: {
      user: {
        select: {
          name: true,
          image: true,
          bio: true,
          location: true,
          website: true,
          twitterHandle: true,
          linkedinUrl: true,
          githubUsername: true,
          repositories: {
            orderBy: { stars: "desc" },
            include: {
              developerInsights: {
                select: {
                  summary: true,
                  highlights: true,
                  techStack: true,
                  status: true,
                },
              },
            },
          },
          skills: {
            where: { category: "LANGUAGE" },
            orderBy: { repoCount: "desc" },
            take: 10,
          },
        },
      },
    },
  });

  // 404 if not found or private
  if (!portfolio || !portfolio.isPublic) notFound();

  const user = portfolio.user;
  const repos = user.repositories;
  const featuredRepoIds = portfolio.featuredRepoIds as string[];

  // Featured repos — use selected order, fall back to top starred
  const featuredRepos =
    featuredRepoIds.length > 0
      ? featuredRepoIds
          .map((id) => repos.find((r) => r.id === id))
          .filter(Boolean)
      : repos.slice(0, 6);

  // Stats
  const totalStars = repos.reduce((s, r) => s + r.stars, 0);
  const totalForks = repos.reduce((s, r) => s + r.forks, 0);
  const insightCount = repos.filter(
    (r) => r.developerInsights?.status === "DONE"
  ).length;
  const topLanguage = user.skills[0]?.name ?? null;

  // AI-discovered tech
  const techMap = new Map<string, number>();
  for (const repo of repos) {
    if (repo.developerInsights?.status === "DONE") {
      const stack = repo.developerInsights.techStack as string[];
      for (const t of stack) {
        techMap.set(t, (techMap.get(t) ?? 0) + 1);
      }
    }
  }
  const discoveredTech = Array.from(techMap.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 24)
    .map(([tech]) => tech);

  // Activity chart — last 6 months
  const now = new Date();
  const activityMap: Record<string, number> = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    activityMap[formatMonth(d)] = 0;
  }
  for (const repo of repos) {
    if (repo.pushedAt) {
      const key = formatMonth(repo.pushedAt);
      if (key in activityMap) activityMap[key]++;
    }
  }
  const activityData = Object.entries(activityMap).map(([month, repos]) => ({
    month,
    repos,
  }));

  return (
    <div className="min-h-screen bg-[hsl(var(--background))] relative paper-grid">
      {/* Sticky nav */}
      <PortfolioNav name={user.name ?? username} />

      {/* Hero */}
      <PortfolioHero
        name={user.name}
        headline={portfolio.headline}
        image={user.image}
        githubUsername={user.githubUsername ?? username}
        location={user.location}
        website={user.website}
        email={portfolio.email}
        showEmail={portfolio.showEmail}
        totalRepos={repos.length}
        totalStars={totalStars}
        totalForks={totalForks}
      />

      {/* About */}
      <PortfolioAbout
        bio={portfolio.bio ?? user.bio}
        location={user.location}
        website={user.website}
        twitterHandle={user.twitterHandle ?? portfolio.twitterHandle}
        linkedinUrl={user.linkedinUrl ?? portfolio.linkedinUrl}
      />

      {/* Featured Projects */}
      <FeaturedProjects
        repos={(featuredRepos as typeof repos).map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description,
          language: r.language,
          topics: r.topics as string[],
          stars: r.stars,
          forks: r.forks,
          url: r.url,
          developerInsights: r.developerInsights
            ? {
                summary: r.developerInsights.summary,
                highlights: r.developerInsights.highlights as string[],
                techStack: r.developerInsights.techStack as string[],
              }
            : null,
        }))}
        ownerUsername={user.githubUsername ?? username}
      />

      {/* Skills + Tech Stack */}
      <SkillsSection
        skills={user.skills.map((s) => ({
          name: s.name,
          proficiencyScore: s.proficiencyScore,
          repoCount: s.repoCount,
        }))}
        discoveredTech={discoveredTech}
      />

      {/* Career Highlights */}
      <CareerHighlights
        totalRepos={repos.length}
        totalStars={totalStars}
        totalForks={totalForks}
        languageCount={user.skills.length}
        topLanguage={topLanguage}
        insightCount={insightCount}
      />

      {/* GitHub Activity */}
      {portfolio.showActivity && <ActivitySection data={activityData} />}

      {/* Contact */}
      <ContactSection
        email={portfolio.email}
        showEmail={portfolio.showEmail}
        website={user.website ?? portfolio.websiteUrl}
        twitterHandle={user.twitterHandle ?? portfolio.twitterHandle}
        linkedinUrl={user.linkedinUrl ?? portfolio.linkedinUrl}
        githubUsername={user.githubUsername ?? username}
      />

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[hsl(var(--border))] text-center">
        <p className="text-xs text-[hsl(var(--muted-foreground))]">
          Built with{" "}
          <a
            href="/"
            className="text-[hsl(var(--primary))] hover:underline"
          >
            DevLaunch AI
          </a>
        </p>
      </footer>
    </div>
  );
}
