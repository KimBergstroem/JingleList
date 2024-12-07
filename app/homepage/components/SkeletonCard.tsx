export default function SkeletonCard() {
  return (
    <div className="card bg-base-100/50 shadow-sm">
      <div className="card-body animate-pulse p-4">
        {/* User info skeleton */}
        <div className="flex items-center gap-3">
          <div className="size-8 rounded-full bg-base-300" />
          <div className="space-y-1.5">
            <div className="h-3 w-20 rounded bg-base-300" />
            <div className="h-2 w-14 rounded bg-base-300" />
          </div>
        </div>

        {/* Items skeleton */}
        <div className="mt-3 space-y-2">
          <div className="h-3 w-3/4 rounded bg-base-300" />
          <div className="h-3 w-2/3 rounded bg-base-300" />
          <div className="h-3 w-1/2 rounded bg-base-300" />
        </div>

        {/* Button skeleton */}
        <div className="mt-3 h-6 w-16 rounded bg-base-300" />
      </div>
    </div>
  )
}
