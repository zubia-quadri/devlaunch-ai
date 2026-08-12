// Shared skeleton shimmer building blocks + page-level skeletons for all dashboard routes.
// Each exported component matches the layout of its corresponding page.

function Shimmer({ className }: { className?: string }) {
  return <div className={`skeleton rounded-xl ${className ?? ""}`} />;
}

// ── Dashboard ───────────────────────────────────────────────
export function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6 max-w-6xl animate-fade-in">
      {/* Header */}
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Shimmer className="h-3 w-28" />
          <Shimmer className="h-8 w-48" />
          <Shimmer className="h-3 w-64" />
        </div>
        <Shimmer className="h-9 w-32 rounded-xl" />
      </div>

      {/* Value prop banner */}
      <Shimmer className="h-28 w-full rounded-2xl" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
            <Shimmer className="w-12 h-12 rounded-xl shrink-0" />
            <div className="space-y-2 flex-1">
              <Shimmer className="h-7 w-16" />
              <Shimmer className="h-3 w-24" />
            </div>
          </div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid lg:grid-cols-5 gap-4">
        <Shimmer className="lg:col-span-2 h-56 rounded-2xl" />
        <Shimmer className="lg:col-span-3 h-56 rounded-2xl" />
      </div>

      {/* Repo cards */}
      <div className="space-y-3">
        <Shimmer className="h-4 w-32" />
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Shimmer key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Repositories ────────────────────────────────────────────
export function RepoListSkeleton() {
  return (
    <div className="p-6 space-y-6 animate-fade-in">
      <div className="flex items-end justify-between">
        <div className="space-y-2">
          <Shimmer className="h-3 w-24" />
          <Shimmer className="h-8 w-44" />
        </div>
        <Shimmer className="h-9 w-28 rounded-xl" />
      </div>
      {/* Search bar */}
      <Shimmer className="h-10 w-full max-w-sm rounded-xl" />
      {/* Grid */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {Array.from({ length: 9 }).map((_, i) => (
          <div key={i} className="p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-3">
            <div className="flex justify-between">
              <Shimmer className="h-4 w-36" />
              <Shimmer className="h-5 w-14 rounded-full" />
            </div>
            <Shimmer className="h-3 w-full" />
            <Shimmer className="h-3 w-3/4" />
            <div className="flex gap-3">
              <Shimmer className="h-3 w-12" />
              <Shimmer className="h-3 w-12" />
              <Shimmer className="h-3 w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Skills ──────────────────────────────────────────────────
export function SkillsSkeleton() {
  return (
    <div className="p-6 space-y-8 max-w-6xl animate-fade-in">
      <div className="space-y-2">
        <Shimmer className="h-3 w-32" />
        <Shimmer className="h-8 w-40" />
        <Shimmer className="h-3 w-56" />
      </div>

      {/* Ring placeholders */}
      <div>
        <Shimmer className="h-3 w-36 mb-5" />
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-3 p-5 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))]">
              <Shimmer className="w-24 h-24 rounded-full" />
              <Shimmer className="h-3 w-16" />
              <Shimmer className="h-2.5 w-12" />
            </div>
          ))}
        </div>
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {Array.from({ length: 8 }).map((_, i) => (
          <Shimmer key={i} className="h-16 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

// ── Settings ────────────────────────────────────────────────
export function SettingsSkeleton() {
  return (
    <div className="p-6 space-y-6 max-w-3xl animate-fade-in">
      <div className="space-y-2">
        <Shimmer className="h-3 w-20" />
        <Shimmer className="h-8 w-32" />
      </div>
      {/* Tab bar */}
      <Shimmer className="h-10 w-52 rounded-xl" />
      {/* Avatar card */}
      <Shimmer className="h-24 w-full rounded-2xl" />
      {/* Form fields */}
      <div className="p-6 rounded-2xl border border-[hsl(var(--border))] bg-[hsl(var(--card))] space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <Shimmer className="h-14 rounded-xl" />
          <Shimmer className="h-14 rounded-xl" />
        </div>
        <Shimmer className="h-24 rounded-xl" />
        <div className="grid sm:grid-cols-2 gap-4">
          <Shimmer className="h-14 rounded-xl" />
          <Shimmer className="h-14 rounded-xl" />
        </div>
        <Shimmer className="h-14 rounded-xl" />
      </div>
      <div className="flex justify-end">
        <Shimmer className="h-10 w-32 rounded-xl" />
      </div>
    </div>
  );
}
