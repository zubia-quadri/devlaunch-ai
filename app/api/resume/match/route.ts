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
        certifications: true,
        achievements: true,
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

    const prompt = `You are a world-class technical recruiter and executive resume writer for elite software engineers applying to top tech companies.

A developer wants to apply for this role:
${jobTitle ? `Job Title: ${jobTitle}` : ''}
${companyName ? `Company: ${companyName}` : ''}

JOB DESCRIPTION:
${jdText}

DEVELOPER'S REPOSITORIES & PROJECTS:
${repoContext}

DEVELOPER'S PROFILE DETAILS:
- Education / Qualifications: ${user?.education || 'Not specified'}
- Stored Certifications: ${user?.certifications || 'None'}
- Stored Achievements: ${user?.achievements || 'None'}

Your task:
1. Select the TOP 2–3 projects most relevant to this job description.
2. For each selected project, write 3 quantified, high-impact bullet points:
   - Start each with a strong past-tense action verb (e.g., Engineered, Architected, Optimized, Implemented).
   - Emphasize business impact, metrics, scalability, and technical depth.
   - Do NOT use generic phrases. Be specific to the project and matching JD keywords.
3. Write a tailored 2–3 sentence professional summary targeting this specific position.
4. Categorize skills matching the JD into 4 standard ATS categories:
   - languages: (e.g., TypeScript, Python, Go, Java, C++, SQL)
   - frameworks: (e.g., React, Next.js, Node.js, Express, FastAPI, Tailwind CSS)
   - tools: (e.g., Docker, Kubernetes, Git, GitHub Actions, AWS, CI/CD, Linux)
   - databases: (e.g., PostgreSQL, MongoDB, Redis, Prisma, MySQL)
5. Format the developer's certifications and achievements cleanly as bullet arrays. If the developer provided any certifications or achievements, preserve and polish them to sound professional. If none were provided, return empty arrays.

Respond ONLY with valid JSON in this exact structure:
{
  "selectedProjects": [
    {
      "name": "project name exactly as given",
      "relevanceReason": "one sentence explaining direct match with job description",
      "bullets": [
        "• Bullet point 1 with action verb and technical metric",
        "• Bullet point 2 with architecture or performance detail", 
        "• Bullet point 3 with implementation impact"
      ],
      "techStack": ["tech1", "tech2", "tech3"]
    }
  ],
  "professionalSummary": "Tailored 2-3 sentence summary aligned with target role.",
  "skills": {
    "languages": ["lang1", "lang2"],
    "frameworks": ["framework1", "framework2"],
    "tools": ["tool1", "tool2"],
    "databases": ["db1", "db2"]
  },
  "certifications": [
    "AWS Certified Solutions Architect – Associate (2024)"
  ],
  "achievements": [
    "Winner, National Hackathon 2023 (1st place out of 1,200+ teams)"
  ]
}`;

    const CANDIDATE_MODELS = ['gemini-2.5-flash', 'gemini-2.0-flash', 'gemini-1.5-flash'];
    let text = '';
    let lastErr: unknown = null;

    for (const mName of CANDIDATE_MODELS) {
      try {
        const model = genAI.getGenerativeModel({
          model: mName,
          generationConfig: {
            maxOutputTokens: 4096,
            temperature: 0.3,
          },
        });
        const result = await model.generateContent(prompt);
        text = result.response.text();
        if (text && text.trim()) break;
      } catch (e) {
        lastErr = e;
        console.warn(`[resume/match] Model ${mName} failed, trying fallback...`, e);
      }
    }

    if (!text) {
      throw lastErr || new Error('All candidate models failed');
    }

    // Extract JSON from response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('Invalid AI response');
    const parsed = JSON.parse(jsonMatch[0]);

    // Fallback reconciliation: ensure user's stored certifications, achievements, and education are present
    const parseLines = (val?: string | null) =>
      val
        ? val
            .split('\n')
            .map(l => l.replace(/^[•\-\*]\s*/, '').trim())
            .filter(Boolean)
        : [];

    if (!Array.isArray(parsed.certifications) || parsed.certifications.length === 0) {
      parsed.certifications = parseLines(user?.certifications);
    }
    if (!Array.isArray(parsed.achievements) || parsed.achievements.length === 0) {
      parsed.achievements = parseLines(user?.achievements);
    }

    // Ensure skills object structure has fallback
    if (Array.isArray(parsed.skills)) {
      parsed.skills = {
        languages: parsed.skills.slice(0, 4),
        frameworks: parsed.skills.slice(4, 8),
        tools: parsed.skills.slice(8, 12),
        databases: [],
      };
    }

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
