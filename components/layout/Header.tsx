import { auth } from "@/lib/auth";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { signOut } from "@/lib/auth";
import Image from "next/image";
import { LogOut, Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  description?: string;
}

export async function Header({ title, description }: HeaderProps) {
  const session = await auth();
  const user = session?.user;

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.8)] backdrop-blur-md">
      {/* Page title */}
      <div>
        <h1 className="text-lg font-semibold text-[hsl(var(--foreground))]">
          {title}
        </h1>
        {description && (
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">
            {description}
          </p>
        )}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />

        {/* Notification placeholder */}
        <button
          id="notifications-btn"
          aria-label="Notifications"
          className="flex items-center justify-center w-9 h-9 rounded-lg border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] transition-all duration-200"
        >
          <Bell className="w-4 h-4" />
        </button>

        {/* User avatar + sign out */}
        {user && (
          <div className="flex items-center gap-2 pl-2 border-l border-[hsl(var(--border))]">
            {user.image && (
              <Image
                src={user.image}
                alt={user.name ?? "User avatar"}
                width={32}
                height={32}
                className="rounded-full ring-2 ring-[hsl(var(--primary)/0.3)]"
              />
            )}
            <div className="hidden sm:block text-right">
              <p className="text-xs font-medium text-[hsl(var(--foreground))] leading-none">
                {user.name}
              </p>
              <p className="text-[10px] text-[hsl(var(--muted-foreground))] mt-0.5">
                @{user.githubUsername}
              </p>
            </div>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/" });
              }}
            >
              <button
                id="sign-out-btn"
                type="submit"
                aria-label="Sign out"
                className="flex items-center justify-center w-8 h-8 rounded-lg text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--destructive))] hover:bg-[hsl(var(--destructive)/0.1)] transition-all duration-200"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
}
