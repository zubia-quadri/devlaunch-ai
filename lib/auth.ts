import NextAuth from "next-auth";
import GitHub from "next-auth/providers/github";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    GitHub({
      clientId: process.env.AUTH_GITHUB_ID!,
      clientSecret: process.env.AUTH_GITHUB_SECRET!,
      allowDangerousEmailAccountLinking: true,
      authorization: {
        params: {
          scope: "read:user user:email public_repo",
        },
      },
    }),
  ],
  callbacks: {
    async session({ session, user }) {
      if (session.user) {
        session.user.id = user.id;
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: user.id },
            select: { githubUsername: true },
          });
          session.user.githubUsername = dbUser?.githubUsername ?? null;
        } catch (e) {
          console.error("[session callback]", e);
          session.user.githubUsername = null;
        }
      }
      return session;
    },

    async signIn({ user, account, profile }) {
      // Always return true — never block sign-in because of our custom logic
      if (account?.provider !== "github" || !profile || !user.id) return true;

      try {
        // Upsert so this works whether the PrismaAdapter has already committed
        // the user row or not (timing varies between Auth.js versions)
        await prisma.user.upsert({
          where: { id: user.id },
          create: {
            id: user.id,
            email: user.email,
            name: user.name,
            image: String(profile.avatar_url ?? ""),
            githubId: String(profile.id),
            githubUsername: String(profile.login),
            githubToken: account.access_token,
          },
          update: {
            githubId: String(profile.id),
            githubUsername: String(profile.login),
            githubToken: account.access_token,
            image: String(profile.avatar_url ?? ""),
          },
        });

        // Auto-create Portfolio if it doesn't exist yet
        await prisma.portfolio.upsert({
          where: { userId: user.id },
          create: {
            userId: user.id,
            username: String(profile.login),
            headline: "Software Developer",
            isPublic: true,
          },
          update: {}, // don't overwrite settings on re-login
        });
      } catch (err) {
        // Log the real error but NEVER block sign-in
        console.error("[signIn callback error]", err);
      }

      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
  session: {
    strategy: "database",
  },
});
