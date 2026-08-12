import { Octokit } from "@octokit/rest";

/**
 * Creates an authenticated Octokit instance.
 * Pass the user's stored GitHub access token from the DB.
 */
export function createOctokit(accessToken: string): Octokit {
  return new Octokit({ auth: accessToken });
}

export type GitHubRepo = {
  id: number;
  name: string;
  full_name: string;
  description: string | null;
  language: string | null;
  topics: string[];
  stargazers_count: number;
  forks_count: number;
  watchers_count: number;
  size: number;
  html_url: string;
  homepage: string | null;
  private: boolean;
  fork: boolean;
  archived: boolean;
  default_branch: string;
  open_issues_count: number;
  pushed_at: string | null;
  created_at: string | null;
};

/**
 * Fetch all public repositories for the authenticated user.
 * Handles pagination automatically (up to 500 repos).
 */
export async function fetchUserRepos(
  octokit: Octokit,
  username: string
): Promise<GitHubRepo[]> {
  const repos: GitHubRepo[] = [];
  let page = 1;

  while (true) {
    const { data } = await octokit.rest.repos.listForUser({
      username,
      type: "owner",
      sort: "updated",
      per_page: 100,
      page,
    });

    repos.push(...(data as GitHubRepo[]));

    if (data.length < 100) break;
    page++;
    if (page > 5) break; // Safety cap at 500 repos
  }

  return repos;
}

/**
 * Fetch a single repository's details.
 */
export async function fetchRepo(
  octokit: Octokit,
  owner: string,
  repo: string
): Promise<GitHubRepo> {
  const { data } = await octokit.rest.repos.get({ owner, repo });
  return data as GitHubRepo;
}

/**
 * Fetch basic GitHub user profile.
 */
export async function fetchGitHubUser(octokit: Octokit) {
  const { data } = await octokit.rest.users.getAuthenticated();
  return data;
}
