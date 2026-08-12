import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileHeader } from "@/components/layout/MobileHeader";
import { FloatingOrbs } from "@/components/ui/FloatingOrbs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/login");

  const [user, portfolio] = await Promise.all([
    prisma.user.findUnique({
      where: { id: session.user.id },
      select: { name: true, image: true, githubUsername: true },
    }),
    prisma.portfolio.findUnique({
      where: { userId: session.user.id },
      select: { username: true },
    }),
  ]);

  return (
    <div className="flex min-h-screen bg-[hsl(var(--background))]">
      <FloatingOrbs />
      <Sidebar
        name={user?.name ?? null}
        image={user?.image ?? null}
        username={user?.githubUsername ?? null}
        portfolioUsername={portfolio?.username ?? null}
      />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <MobileHeader />
        {children}
      </div>
    </div>
  );
}
