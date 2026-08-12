import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const portfolioSchema = z.object({
  headline:       z.string().max(160).optional(),
  bio:            z.string().max(1000).optional(),
  email:          z.string().email().or(z.literal("")).optional(),
  linkedinUrl:    z.string().url().or(z.literal("")).optional(),
  twitterHandle:  z.string().max(50).optional(),
  websiteUrl:     z.string().url().or(z.literal("")).optional(),
  isPublic:       z.boolean().optional(),
  showEmail:      z.boolean().optional(),
  showActivity:   z.boolean().optional(),
  featuredRepoIds: z.array(z.string()).max(6).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = portfolioSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    // Upsert — portfolio may not exist yet for older accounts
    const portfolio = await prisma.portfolio.upsert({
      where: { userId: session.user.id },
      create: {
        userId: session.user.id,
        username: session.user.githubUsername ?? session.user.id,
        ...parsed.data,
      },
      update: parsed.data,
    });

    return NextResponse.json({ success: true, portfolio });
  } catch (error) {
    console.error("[Settings Portfolio PATCH]", error);
    return NextResponse.json({ error: "Failed to save portfolio settings." }, { status: 500 });
  }
}
