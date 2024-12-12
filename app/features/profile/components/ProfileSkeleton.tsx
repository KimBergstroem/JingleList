export function ProfileSkeleton() {
  return (
    <div className="animate-pulse space-y-6">
      <div className="flex items-center gap-4">
        <div className="size-24 rounded-full bg-base-300" />
        <div className="space-y-2">
          <div className="h-8 w-48 rounded bg-base-300" />
          <div className="h-4 w-32 rounded bg-base-300" />
        </div>
      </div>
      <div className="divider" />
      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-base-300" />
          <div className="h-10 w-full rounded bg-base-300" />
        </div>
        <div className="space-y-2">
          <div className="h-4 w-20 rounded bg-base-300" />
          <div className="h-10 w-full rounded bg-base-300" />
        </div>
      </div>
    </div>
  )
}
