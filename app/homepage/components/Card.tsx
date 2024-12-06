import Image from "next/image"
import Link from "next/link"

type CardProps = {
  userId: string
  userName: string
  profileImage: string
  occasion: string
  wishlistItems: {
    id: string
    title: string
    description: string
    price: number
  }[]
}

const occasionColors: Record<string, string> = {
  Christmas: "bg-red-500/10 hover:bg-red-500/20",
  Birthday: "bg-purple-500/10 hover:bg-purple-500/20",
  "Father's Day": "bg-blue-500/10 hover:bg-blue-500/20",
  "Mother's Day": "bg-pink-500/10 hover:bg-pink-500/20",
  "Valentine's Day": "bg-rose-500/10 hover:bg-rose-500/20",
  Other: "bg-gray-500/10 hover:bg-gray-500/20",
}

export default function Card({
  userId,
  userName,
  profileImage,
  occasion,
  wishlistItems,
}: CardProps) {
  const bgColor = occasionColors[occasion] || occasionColors.Other

  return (
    <Link
      href={`/users/${userId}`}
      className="block transition-transform hover:scale-[1.02]"
    >
      <div
        className={`card relative ${bgColor} transition-colors duration-200`}
      >
        {/* Profile Image */}
        <div className="absolute -left-2 -top-2 z-10">
          <div className="size-10 overflow-hidden rounded-full ring-2 ring-base-100">
            <Image
              src={profileImage}
              alt={`${userName}&apos;s profile`}
              width={40}
              height={40}
              className="size-full object-cover"
            />
          </div>
        </div>

        <div className="card-body pt-8">
          {/* Occasion Tag */}
          <div className="mb-4 text-center text-sm font-medium opacity-75">
            {occasion} List
          </div>

          {/* Items List */}
          <ul className="space-y-2">
            {wishlistItems.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between rounded-lg bg-base-100/50 p-2"
              >
                <span className="font-medium">{item.title}</span>
                <span className="text-primary">{item.price} kr</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Link>
  )
}
