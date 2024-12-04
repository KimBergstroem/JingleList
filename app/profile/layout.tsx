import Link from "next/link"

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col gap-8 md:flex-row">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64">
          <nav className="flex flex-col gap-2">
            <Link href="/profile" className="btn btn-ghost justify-start">
              Profile
            </Link>
            <Link
              href="/profile/settings"
              className="btn btn-ghost justify-start"
            >
              Settings
            </Link>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="rounded-lg bg-base-200 p-6 shadow-lg">{children}</div>
        </main>
      </div>
    </div>
  )
}
