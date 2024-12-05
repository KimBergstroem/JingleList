import Link from "next/link"

import { FacebookIcon, TwitterIcon, YoutubeIcon } from "@/components/ui/icons"

export default function Footer() {
  return (
    <footer className="footer bg-base-300 p-10 text-base-content">
      <nav>
        <h6 className="footer-title">Services</h6>
        <Link href="/services/branding" className="link-hover link">
          Branding
        </Link>
        <Link href="/services/design" className="link-hover link">
          Shopping
        </Link>
        <Link href="/services/marketing" className="link-hover link">
          Browse
        </Link>
        <Link href="/services/advertisement" className="link-hover link">
          Santa
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Company</h6>
        <Link href="/about" className="link-hover link">
          About us
        </Link>
        <Link href="/contact" className="link-hover link">
          Contact
        </Link>
        <Link href="/jobs" className="link-hover link">
          How to
        </Link>
        <Link href="/press" className="link-hover link">
          Policy
        </Link>
      </nav>
      <nav>
        <h6 className="footer-title">Social</h6>
        <div className="grid grid-flow-col gap-4">
          <Link
            href="https://twitter.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <TwitterIcon />
          </Link>
          <Link
            href="https://youtube.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <YoutubeIcon />
          </Link>
          <Link
            href="https://facebook.com"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FacebookIcon />
          </Link>
        </div>
      </nav>
    </footer>
  )
}
