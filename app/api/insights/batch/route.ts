import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateRepoInsights } from "@/lib/gemini";
import { rateLimit } from "@/lib/rateLimit";

// Generates insights for repos that are missing, errored, or stuck analyzing
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 5 batch runs per 5 minutes per user
    const rl = rateLimit(session.user.id, "batch", 5, 5 * 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Batch analysis is rate limited. Please wait a few minutes before trying again." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter) } }
      );
    }

    const userId = session.user.id;

    // Find repos with no insights OR with ERROR/ANALYZING (stuck/failed) status
    const repos = await prisma.repository.findMany({
      where: {
        userId,
        isFork: false,
        OR: [
          { developerInsights: null },
          { developerInsights: { status: { in: ["ERROR", "ANALYZING"] } } },
        ],
      },
      include: { developerInsights: { select: { id: true, status: true } } },
      take: 10,
    });

    if (repos.length === 0) {
      return NextResponse.json({ success: true, generated: 0, message: "All repos already have insights." });
    }

    let generated = 0;
    let failed = 0;

    for (const repo of repos) {
      try {
        // Mark as analyzing (upsert handles both new and retry cases)
        await prisma.developerInsights.upsert({
          where: { repositoryId: repo.id },
          create: { repositoryId: repo.id, status: "ANALYZING" },
          update: { status: "ANALYZING" },
        });

        const insights = await generateRepoInsights({
          name: repo.name,
          description: repo.description,
          language: repo.language,
          topics: repo.topics as string[],
          stars: repo.stars,
          forks: repo.forks,
        });

        if (insights) {
          await prisma.developerInsights.update({
            where: { repositoryId: repo.id },
            data: {
              status: "DONE",
              summary: insights.summary,
              highlights: insights.highlights,
              techStack: insights.techStack,
              useCases: insights.useCases,
              targetAudience: insights.targetAudience,
              complexityScore: insights.complexityScore,
              analyzedAt: new Date(),
            },
          });
          generated++;
        } else {
          await prisma.developerInsights.update({
            where: { repositoryId: repo.id },
            data: { status: "ERROR" },
          });
          failed++;
        }
      } catch (err) {
        console.error(`[Insights Batch] Failed for repo ${repo.name}:`, err);
        await prisma.developerInsights.upsert({
          where: { repositoryId: repo.id },
          create: { repositoryId: repo.id, status: "ERROR" },
          update: { status: "ERROR" },
        });
        failed++;
      }
    }

    return NextResponse.json({
      success: true,
      generated,
      failed,
      message: `Generated ${generated} insights${failed > 0 ? `, ${failed} failed` : ""}.`,
    });
  } catch (error) {
    console.error("[Insights Batch]", error);
    return NextResponse.json({ error: "Batch generation failed." }, { status: 500 });
  }
}
