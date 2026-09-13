import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { rateLimit } from '@/lib/rateLimit';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const rl = rateLimit(session.user.id, 'resume-match', 10, 60 * 60_000);
    if (!rl.allowed) {
      return NextResponse.json({ error: 'Rate limited. Try again in an hour.' }, { status: 429 });
    }

    const { jdText, jobTitle, companyName } = await req.json();
    if (!jdText || jdText.trim().length < 50) {
      return NextResponse.json({ error: 'Job description too short.' }, { status: 400 });
    }

    // Get user info
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        name: true,
        email: true,
        phone: true,
        location: true,
        linkedinUrl: true,
        education: true,
        currentRole: true,
        githubUsername: true,
        website: true,
      },
    });

    // Get repos with insights
    const repos = await prisma.repository.findMany({
      where: { userId: session.user.id, isArchived: false, isFork: false },
      include: { developerInsights: true },
      orderBy: { stars: 'desc' },
      take: 30,
    });

    const reposWithInsights = repos.filter(r => r.developerInsights?.status === 'DONE');

    if (reposWithInsights.length === 0) {
      return NextResponse.json({ error: 'No analyzed projects found. Please generate AI insights for your repos first.' }, { status: 400 });
    }

    // Build repo context for Gemini
    const repoContext = reposWithInsights.map((r, i) => (
      `Project ${i + 1}: ${r.name}\n` +
      `Description: ${r.description || 'N/A'}\n` +
      `Tech Stack: ${r.developerInsights?.techStack?.join(', ') || r.language || 'N/A'}\n` +
      `AI Summary: ${r.developerInsights?.summary || 'N/A'}\n` +
      `Stars: ${r.stars}`
    )).join('\n\n');

    const prompt = `You are an expert resume writer and technical recruiter.

A developer wants to apply for this job:
${jobTitle ? `Job Title: ${jobTitle}` : ''}
${companyName ? `Company: ${companyName}` : ''}

JOB DESCRIPTION:
${jdText}

DEVELOPER'S PROJECTS:
${repoContext}

Your task:
1. Select the TOP 2-3 projects most relevant to this job (pick exactly 3 if possible, 2 if only 2 are relevant)
2. For each selected project, write 3 powerful resume bullet points (achievement-oriented, start with action verbs, quantify where possible based on stars/complexity)
3. Write a tailored 3-sentence professional summary for this specific job
4. List the top 8-10 skills from the projects that match this JD

Respond ONLY with valid JSON in this exact format:
{
  "selectedProjects": [
    {
      "name": "project name exactly as given",
      "relevanceReason": "one sentence why this project matches the JD",
      "bullets": [
        "• Bullet point 1",
        "• Bullet point 2", 
        "• Bullet point 3"
      ],
      "techStack": ["tech1", "tech2"]
    }
  ],
  "professionalSummary": "3-sentence tailored summary",
  "skills": ["skill1", "skill2", "skill3", "skill4", "skill5", "skill6", "skill7", "skill8"]
}`;

    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response');
    const parsed = JSON.parse(jsonMatch[0]);

    // Save to DB
    await prisma.resumeGeneration.create({
      data: {
        userId: session.user.id,
        jdText,
        jobTitle: jobTitle || null,
        companyName: companyName || null,
        result: JSON.stringify(parsed),
      },
    });

    return NextResponse.json({ success: true, data: parsed, user });
  } catch (err) {
    console.error('[resume/match]', err);
    return NextResponse.json({ error: 'Failed to generate resume. Please try again.' }, { status: 500 });
  }
}
