import type { Metadata } from "next"

import Footer from "@/components/layout/footer/Footer"
import Navbar from "@/components/layout/navbar/Navbar"

import "./globals.css"

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" data-theme="sunset">
      <body className="flex min-h-screen flex-col">
        <Navbar />
        <main className="grow py-8">
          <div className="container-wrapper">{children}</div>
        </main>
        <Footer />
      </body>
    </html>
  )
}
