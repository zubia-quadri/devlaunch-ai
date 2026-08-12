import { type DefaultSession } from "next-auth";

// Extend the built-in session/user types with our custom fields
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      githubUsername: string | null;
    } & DefaultSession["user"];
  }
}
