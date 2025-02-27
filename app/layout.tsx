import '@/app/ui/global.css';
import { inter } from '@/app/ui/fonts';
import type { Metadata } from 'next'
import {
  ClerkProvider,
  SignInButton,
  SignUpButton,
  SignedIn,
  SignedOut,
  UserButton,
} from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from '@/components/ui/toaster'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'Amanda Party & Event Rentals',
  description: 'Your one-stop shop for party and event rentals',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className} ${geistSans.variable} ${geistMono.variable} antialiased`}>
          <header className="flex justify-end items-center px-4 py-2 h-12 bg-white shadow-sm">
            <SignedOut>
              <div className="flex gap-2">
                <SignInButton mode="modal">
                  <button className="text-sm text-[#235082] hover:text-[#235082]/80">
                    Sign In
                  </button>
                </SignInButton>
                <SignUpButton mode="modal">
                  <button className="text-sm bg-[#235082] text-white px-3 py-1 rounded-md hover:bg-[#235082]/90">
                    Sign Up
                  </button>
                </SignUpButton>
              </div>
            </SignedOut>
            <SignedIn>
              <UserButton afterSignOutUrl="/" />
            </SignedIn>
          </header>
          <main className="min-h-[calc(100vh-3rem)]">
            {children}
          </main>
          <Toaster />
        </body>
      </html>
    </ClerkProvider>
  )
}
