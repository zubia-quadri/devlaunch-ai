import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createOctokit, fetchUserRepos } from "@/lib/github";
import { rateLimit } from "@/lib/rateLimit";

export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 3 imports per 10 minutes per user
    const rl = rateLimit(session.user.id, "github-import", 3, 10 * 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Import is rate limited. Please wait before importing again." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const userId = session.user.id;

    // Fetch the user's stored GitHub token and username
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { githubToken: true, githubUsername: true },
    });

    if (!user?.githubToken || !user?.githubUsername) {
      return NextResponse.json(
        { error: "GitHub token not found. Please sign in again." },
        { status: 400 }
      );
    }

    const octokit = createOctokit(user.githubToken);
    const repos = await fetchUserRepos(octokit, user.githubUsername);

    // Upsert each repo into the DB
    let imported = 0;
    const languageMap: Record<string, { count: number; stars: number }> = {};

    for (const repo of repos) {
      await prisma.repository.upsert({
        where: { userId_githubId: { userId, githubId: String(repo.id) } },
        create: {
          userId,
          githubId: String(repo.id),
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          language: repo.language,
          topics: repo.topics ?? [],
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          watchers: repo.watchers_count,
          size: repo.size,
          url: repo.html_url,
          homepage: repo.homepage,
          isPrivate: repo.private,
          isFork: repo.fork,
          isArchived: repo.archived,
          defaultBranch: repo.default_branch,
          openIssues: repo.open_issues_count,
          pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
          syncedAt: new Date(),
        },
        update: {
          name: repo.name,
          fullName: repo.full_name,
          description: repo.description,
          language: repo.language,
          topics: repo.topics ?? [],
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          watchers: repo.watchers_count,
          size: repo.size,
          url: repo.html_url,
          homepage: repo.homepage,
          isPrivate: repo.private,
          isFork: repo.fork,
          isArchived: repo.archived,
          openIssues: repo.open_issues_count,
          pushedAt: repo.pushed_at ? new Date(repo.pushed_at) : null,
          syncedAt: new Date(),
        },
      });

      imported++;

      // Aggregate languages for skill computation
      if (repo.language) {
        if (!languageMap[repo.language]) {
          languageMap[repo.language] = { count: 0, stars: 0 };
        }
        languageMap[repo.language].count++;
        languageMap[repo.language].stars += repo.stargazers_count;
      }
    }

    // Upsert UserSkill records per language
    for (const [lang, data] of Object.entries(languageMap)) {
      const proficiency = Math.min(
        100,
        Math.round((data.count / repos.length) * 60 + Math.min(data.stars, 40))
      );
      await prisma.userSkill.upsert({
        where: { userId_name: { userId, name: lang } },
        create: {
          userId,
          name: lang,
          category: "LANGUAGE",
          repoCount: data.count,
          proficiencyScore: proficiency,
        },
        update: {
          repoCount: data.count,
          proficiencyScore: proficiency,
        },
      });
    }

    return NextResponse.json({
      success: true,
      imported,
      message: `Successfully imported ${imported} repositories.`,
    });
  } catch (error) {
    console.error("[GitHub Import]", error);
    return NextResponse.json(
      { error: "Failed to import repositories. Please try again." },
      { status: 500 }
    );
  }
}
