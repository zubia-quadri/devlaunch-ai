import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { generateRepoInsights } from "@/lib/gemini";
import { rateLimit } from "@/lib/rateLimit";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Rate limit: 5 insight generations per minute per user
    const rl = rateLimit(session.user.id, "insights", 5, 60_000);
    if (!rl.allowed) {
      return NextResponse.json(
        { error: "Too many requests. Please wait before generating more insights." },
        { status: 429, headers: { "Retry-After": String(rl.retryAfter), "X-RateLimit-Remaining": "0" } }
      );
    }

    const body = await req.json();
    const { repoId } = body as { repoId: string };

    if (!repoId) {
      return NextResponse.json({ error: "repoId is required" }, { status: 400 });
    }

    // Verify ownership
    const repo = await prisma.repository.findFirst({
      where: { id: repoId, userId: session.user.id },
      include: { developerInsights: true },
    });

    if (!repo) {
      return NextResponse.json({ error: "Repository not found" }, { status: 404 });
    }

    // Mark as analyzing
    await prisma.developerInsights.upsert({
      where: { repositoryId: repoId },
      create: { repositoryId: repoId, status: "ANALYZING" },
      update: { status: "ANALYZING" },
    });

    // Call Gemini
    const insights = await generateRepoInsights({
      name: repo.name,
      description: repo.description,
      language: repo.language,
      topics: repo.topics as string[],
      stars: repo.stars,
      forks: repo.forks,
    });

    if (!insights) {
      await prisma.developerInsights.update({
        where: { repositoryId: repoId },
        data: { status: "ERROR" },
      });
      return NextResponse.json(
        { error: "AI generation failed. Please try again." },
        { status: 500 }
      );
    }

    // Save results
    const saved = await prisma.developerInsights.update({
      where: { repositoryId: repoId },
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

    return NextResponse.json({ success: true, insights: saved });
  } catch (error) {
    console.error("[Insights Generate]", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
