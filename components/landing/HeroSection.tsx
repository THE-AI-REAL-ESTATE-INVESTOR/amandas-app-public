'use client'

import Link from 'next/link';
import { lusitana } from '@/app/ui/fonts';
import { Button } from '@/components/ui/button';
import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import { BookButton } from '@/components/booking/BookButton';

interface HeroSectionProps {
  brandName: string;
  brandSlogan: string;
  colors: {
    background: string;
    text: string;
    primary: string;
    secondary: string;
    muted: string;
  };
}

export const HeroSection = ({ brandName, brandSlogan, colors }: HeroSectionProps) => {
  return (
    <div className="relative h-[600px] flex items-center justify-center bg-secondary/10">
      <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
        <h1 className={`${lusitana.className} text-4xl sm:text-6xl font-bold text-foreground mb-6`}>
          {brandName}
        </h1>
        <p className="text-xl sm:text-2xl text-foreground/80 mb-8">
          {brandSlogan}
        </p>
        <div className="flex flex-col gap-8">
          <div className="flex flex-row gap-4 justify-center items-center">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-3 rounded-lg text-lg"
            >
              <Link href="/rentals">Browse Rentals</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-background hover:bg-muted/50 text-foreground px-8 py-3 rounded-lg text-lg border-primary/20"
            >
              <Link href="/contact">Contact Us</Link>
            </Button>
            <SignedOut>
              <SignInButton mode="modal">
                <Button variant="outline" className="bg-background hover:bg-muted/50">
                  Sign In
                </Button>
              </SignInButton>
            </SignedOut>
            <SignedIn>
              <div className="flex items-center gap-4">
                <Link href="/dashboard">
                  <Button variant="outline" className="bg-background hover:bg-muted/50">
                    My Dashboard
                  </Button>
                </Link>
                <UserButton afterSignOutUrl="/" />
              </div>
            </SignedIn>
          </div>
          <div className="flex justify-center">
            <BookButton />
          </div>
        </div>
      </div>
    </div>
  );
};
