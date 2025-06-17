import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Toaster } from "sonner"
import "./globals.css"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
})

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
})

export const metadata: Metadata = {
  title: {
    default: "SpecMaster",
    template: "%s | SpecMaster",
  },
  description: "The bartender's learning companion. Master recipes, techniques, and the craft of cocktails.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${playfair.variable} font-sans antialiased`}>
        {children}
        <Toaster
          theme="dark"
          position="bottom-right"
          toastOptions={{
            style: {
              background: "oklch(0.15 0.01 264)",
              border: "1px solid oklch(0.25 0.01 264)",
              color: "oklch(0.94 0.013 85)",
            },
          }}
        />
      </body>
    </html>
  )
}
