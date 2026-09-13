import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const profileSchema = z.object({
  name:          z.string().min(1).max(100).optional(),
  bio:           z.string().max(500).optional(),
  location:      z.string().max(100).optional(),
  website:       z.string().url().or(z.literal("")).optional(),
  twitterHandle: z.string().max(50).optional(),
  linkedinUrl:   z.string().url().or(z.literal("")).optional(),
  phone:         z.string().max(30).optional(),
  education:     z.string().max(200).optional(),
  currentRole:   z.string().max(100).optional(),
});

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const parsed = profileSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid data", details: parsed.error.flatten() },
        { status: 422 }
      );
    }

    const updated = await prisma.user.update({
      where: { id: session.user.id },
      data: parsed.data,
      select: {
        id: true,
        name: true,
        bio: true,
        location: true,
        website: true,
        twitterHandle: true,
        linkedinUrl: true,
        phone: true,
        education: true,
        currentRole: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error) {
    console.error("[Settings Profile PATCH]", error);
    return NextResponse.json({ error: "Failed to save profile." }, { status: 500 });
  }
}
