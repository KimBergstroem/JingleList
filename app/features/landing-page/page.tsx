"use client"

import Image from "next/image"
import Link from "next/link"

import {
  CheckIcon,
  LightningIcon,
  ListIcon,
  LockIcon,
  PlusIcon,
  ShareIcon,
  UsersIcon,
} from "@/components/ui/icons"

import styles from "./landing-page.module.css"

export default function LandingPage() {
  return (
    <div className="space-y-32">
      {/* Hero Section */}
      <div className={`hero ${styles.heroContainer}`}>
        <div className={`hero-content ${styles.heroContent}`}>
          <div className={styles.imageContainer}>
            <div className={styles.imageWrapper}>
              <Image
                src="/images/hero-image.jpg"
                alt="JingleList Hero Image"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority
              />
            </div>
            <div className={styles.freeLabel}>
              <span className="text-center text-sm font-bold">
                Free to use!
              </span>
            </div>
          </div>
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>Create your wishlist easily!</h1>
            <p className={styles.heroDescription}>
              With JingleList, you can easily create and share your wishlists
              with family and friends. Perfect for birthdays, Christmas and
              other special occasions.
            </p>
            <Link href="/auth/register" className="btn btn-primary">
              Get started
            </Link>
          </div>
        </div>
      </div>

      {/* Value Proposition Section */}
      <div className="bg-base-200 py-24">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="mb-6 text-3xl font-bold sm:text-4xl">
              Make Gift-Giving <span className="text-primary">Magical</span>
            </h2>
            <div className="mx-auto max-w-2xl space-y-4">
              <p className="text-base text-base-content/80 sm:text-lg">
                Create, share, and manage your wishlists with loved ones. Keep
                the surprise while making sure everyone gets what they wish for!
              </p>
              <div className="flex flex-wrap justify-center gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-5 text-success" />
                  <span>Easy sharing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-5 text-success" />
                  <span>No duplicate gifts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckIcon className="size-5 text-success" />
                  <span>Keep surprises intact</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className={styles.featureSection}>
        <h2 className={styles.featureTitle}>Features</h2>
        <div className={styles.featureGrid}>
          <div className={styles.featureCard}>
            <div className="card-body">
              <div className={styles.featureIcon}>
                <PlusIcon />
              </div>
              <h2 className="card-title">Create Lists</h2>
              <p>Create unlimited wishlists for different occasions.</p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className="card-body">
              <div
                className={`${styles.featureIcon} !bg-secondary/10 !text-secondary`}
              >
                <ShareIcon />
              </div>
              <h2 className="card-title">Share Easily</h2>
              <p>
                Share your lists with friends and family with a simple link.
              </p>
            </div>
          </div>

          <div className={styles.featureCard}>
            <div className="card-body">
              <div
                className={`${styles.featureIcon} !bg-accent/10 !text-accent`}
              >
                <LockIcon />
              </div>
              <h2 className="card-title">Keep Surprises</h2>
              <p>See whats bought without spoiling the surprise.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="hero bg-base-200 py-20">
        <div className="hero-content text-center">
          <div className="max-w-md">
            <h2 className="mb-8 text-3xl font-bold">Ready to start?</h2>
            <p className="mb-8 text-lg">
              Create your account today and start organizing your wishlists in a
              smarter way.
            </p>
            <Link href="/auth/register" className="btn btn-primary btn-lg">
              Create Account
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="container-wrapper">
        <div className={styles.statsContainer}>
          <div className="stat">
            <div className={styles.statFigure}>
              <UsersIcon />
            </div>
            <div className="stat-title">Satisfied Users</div>
            <div className="stat-value text-primary">25.6K</div>
            <div className="stat-desc">↗︎ 400 (2%)</div>
          </div>

          <div className="stat">
            <div className={`${styles.statFigure} !text-secondary`}>
              <ListIcon />
            </div>
            <div className="stat-title">Active Lists</div>
            <div className="stat-value text-secondary">2.6M</div>
            <div className="stat-desc">↗︎ 90 (14%)</div>
          </div>

          <div className="stat">
            <div className={`${styles.statFigure} !text-accent`}>
              <LightningIcon />
            </div>
            <div className="stat-title">Fulfilled Wishes</div>
            <div className="stat-value text-accent">86%</div>
            <div className="stat-desc">↗︎ 4% more than last month</div>
          </div>
        </div>
      </div>
    </div>
  )
}
