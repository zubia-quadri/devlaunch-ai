import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Fallback models in priority order to handle transient 503s or capacity spikes
const CANDIDATE_MODELS = [
  "gemini-3.6-flash",
  "gemini-3.5-flash",
  "gemini-3.5-flash-lite",
  "gemini-3.8-flash",
];

// ─── Types ───────────────────────────────────────────────────────────────────

export type RepoInsightsV1 = {
  summary: string;
  highlights: string[];
  techStack: string[];
  useCases: string;
  targetAudience: string;
  complexityScore: number;
};

export type AggregateInsights = {
  strongestTechnologies: { name: string; evidence: string }[];
  repositoryCategories: { category: string; repos: string[] }[];
  codingTrends: string[];
  suggestedLearningAreas: string[];
};

// ─── V1 per-repo prompt ───────────────────────────────────────────────────────

export function buildRepoInsightsPrompt(repo: {
  name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stars: number;
  forks: number;
}): string {
  return `You are a senior software engineer and technical writer. Analyze this GitHub repository and return a JSON object.

Repository details:
- Name: ${repo.name}
- Description: ${repo.description ?? "None provided"}
- Primary language: ${repo.language ?? "Unknown"}
- Topics/tags: ${repo.topics.length > 0 ? repo.topics.join(", ") : "None"}
- Stars: ${repo.stars}
- Forks: ${repo.forks}

Return ONLY valid JSON matching this exact schema (no markdown, no extra text):
{
  "summary": "2-3 sentence professional description suitable for a recruiter or hiring manager",
  "highlights": ["array of 3-5 key technical achievements or interesting aspects"],
  "techStack": ["array of all detected technologies beyond the primary language"],
  "useCases": "brief description of real-world applications or problems this project solves",
  "targetAudience": "who would find this project valuable (developers, businesses, students, etc.)",
  "complexityScore": 7
}

Ensure complexityScore is an integer from 1 (trivial) to 10 (highly complex).`;
}

// ─── Aggregate profile-level prompt ──────────────────────────────────────────

export function buildAggregateInsightsPrompt(repos: {
  name: string;
  language: string | null;
  topics: string[];
  stars: number;
  pushedAt: Date | null;
}[]): string {
  const repoSummaries = repos
    .slice(0, 50) // Cap to avoid token overflow
    .map(
      (r) =>
        `- ${r.name} (${r.language ?? "unknown"}, stars: ${r.stars}, topics: ${r.topics.join(", ") || "none"}, last pushed: ${r.pushedAt?.getFullYear() ?? "unknown"})`
    )
    .join("\n");

  return `You are a senior engineering career advisor. Analyze this developer's GitHub repository portfolio and return a JSON object.

Repositories:
${repoSummaries}

Return ONLY valid JSON matching this exact schema (no markdown, no extra text):
{
  "strongestTechnologies": [
    { "name": "TypeScript", "evidence": "Used in 8 repositories including the most starred projects" }
  ],
  "repositoryCategories": [
    { "category": "Web Applications", "repos": ["repo-a", "repo-b"] }
  ],
  "codingTrends": [
    "Increasing adoption of TypeScript over JavaScript since 2022",
    "Growing focus on API development and backend systems"
  ],
  "suggestedLearningAreas": [
    "Testing and CI/CD pipelines — few repositories include test suites",
    "Cloud infrastructure — strong application code but limited DevOps tooling"
  ]
}

Provide 3-5 items for strongestTechnologies, 3-5 categories, 2-4 trends, and 3-4 learning suggestions.`;
}

// ─── Helper function to generate with model fallback ─────────────────────────

async function generateWithFallback(prompt: string): Promise<string> {
  let lastError: unknown = null;

  for (const modelName of CANDIDATE_MODELS) {
    try {
      const model = genAI.getGenerativeModel({
        model: modelName,
        generationConfig: {
          temperature: 0.4,
          topK: 32,
          topP: 0.9,
          maxOutputTokens: 4096,
          responseMimeType: "application/json",
        },
      });

      const result = await model.generateContent(prompt);
      const text = result.response.text();
      if (text && text.trim()) {
        return text;
      }
    } catch (err) {
      lastError = err;
      console.warn(`[Gemini] Model ${modelName} failed, trying next candidate:`, err instanceof Error ? err.message : err);
    }
  }

  throw lastError ?? new Error("All Gemini models failed");
}

function cleanJsonText(raw: string): string {
  let text = raw.trim();
  if (text.startsWith("```json")) {
    text = text.slice(7);
  } else if (text.startsWith("```")) {
    text = text.slice(3);
  }
  if (text.endsWith("```")) {
    text = text.slice(0, -3);
  }
  return text.trim();
}

// ─── Generator functions ──────────────────────────────────────────────────────

/**
 * Generate V1 Developer Insights for a single repository.
 * Returns null if generation fails.
 */
export async function generateRepoInsights(
  repo: Parameters<typeof buildRepoInsightsPrompt>[0]
): Promise<RepoInsightsV1 | null> {
  try {
    const prompt = buildRepoInsightsPrompt(repo);
    const text = await generateWithFallback(prompt);
    const cleaned = cleanJsonText(text);
    return JSON.parse(cleaned) as RepoInsightsV1;
  } catch (error) {
    console.error("[Gemini] generateRepoInsights failed:", error);
    return null;
  }
}

/**
 * Generate aggregate Developer Insights across all user repos.
 * Returns null if generation fails.
 */
export async function generateAggregateInsights(
  repos: Parameters<typeof buildAggregateInsightsPrompt>[0]
): Promise<AggregateInsights | null> {
  try {
    const prompt = buildAggregateInsightsPrompt(repos);
    const text = await generateWithFallback(prompt);
    const cleaned = cleanJsonText(text);
    return JSON.parse(cleaned) as AggregateInsights;
  } catch (error) {
    console.error("[Gemini] generateAggregateInsights failed:", error);
    return null;
  }
}
