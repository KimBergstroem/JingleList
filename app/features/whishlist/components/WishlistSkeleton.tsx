export function WishlistSkeleton() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-48 animate-pulse rounded bg-base-300" />
        <div className="h-10 w-32 animate-pulse rounded bg-base-300" />
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="space-y-3 rounded-lg border border-gray-800 p-4"
            >
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="py-2">
                    <div className="h-4 w-16 animate-pulse rounded bg-base-300" />
                  </div>
                  <div className="rounded-md bg-base-300 px-3 py-2">
                    <div className="h-6 w-24 animate-pulse rounded bg-base-200" />
                  </div>
                </div>
                <div className="text-right">
                  <div className="h-4 w-24 animate-pulse rounded bg-base-300" />
                  <div className="mt-2 h-4 w-16 animate-pulse rounded bg-base-300" />
                </div>
              </div>

              <div>
                <div className="h-7 w-48 animate-pulse rounded bg-base-300" />
              </div>

              <div className="h-4 w-3/4 animate-pulse rounded bg-base-300" />

              <div className="flex items-center justify-between">
                <div className="h-4 w-32 animate-pulse rounded bg-base-300" />
                <div className="size-8 animate-pulse rounded bg-base-300" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
