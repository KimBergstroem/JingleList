export default function AboutPage() {
  return (
    <div className="container-wrapper">
      <h1 className="mb-6 text-4xl font-bold">About JingleList</h1>

      <div className="space-y-6">
        <section>
          <h2 className="mb-3 text-2xl font-semibold">Our Story</h2>
          <p className="text-lg">
            JingleList was created with a simple mission: to make holiday
            gift-giving more organized, fun, and surprise-friendly. We
            understand the joy of both giving and receiving the perfect gift,
            and we want to help make that experience even better.
          </p>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">How It Works</h2>
          <div className="space-y-3">
            <p className="text-lg">
              Create your wishlist and share it with family and friends. When
              someone buys an item from your list, they can mark it as purchased
              - visible to others but hidden from you, keeping the surprise
              intact!
            </p>
            <ul className="ml-6 list-disc space-y-2">
              <li>Create and manage your personal wishlist</li>
              <li>Share lists with family and friends</li>
              <li>Mark items as purchased (visible only to others)</li>
              <li>Keep track of your gift-buying progress</li>
              <li>Organize gifts by occasion and priority</li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Our Features</h2>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-lg bg-base-200 p-4">
              <h3 className="mb-2 font-semibold">Wishlist Management</h3>
              <p>Create, edit, and organize your wishlists with ease.</p>
            </div>
            <div className="rounded-lg bg-base-200 p-4">
              <h3 className="mb-2 font-semibold">Privacy Control</h3>
              <p>Choose who can see your lists and what they can do.</p>
            </div>
            <div className="rounded-lg bg-base-200 p-4">
              <h3 className="mb-2 font-semibold">Gift Tracking</h3>
              <p>Keep track of purchased gifts while maintaining surprises.</p>
            </div>
            <div className="rounded-lg bg-base-200 p-4">
              <h3 className="mb-2 font-semibold">Occasion Reminders</h3>
              <p>Never miss an important gift-giving occasion.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="mb-3 text-2xl font-semibold">Contact Us</h2>
          <p className="text-lg">
            Have questions or suggestions? We&apos;d love to hear from you!
            Contact us at{" "}
            <a href="mailto:support@jinglelist.com" className="text-primary">
              support@jinglelist.com
            </a>
          </p>
        </section>
      </div>
    </div>
  )
}
