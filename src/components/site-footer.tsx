"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Github, Linkedin, Twitter } from "lucide-react";
import { Logo } from "./logo";
import { Button } from "./ui/button";

export function SiteFooter() {
  const [currentYear, setCurrentYear] = useState<number>(2025);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    setCurrentYear(new Date().getFullYear());
  }, []);
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-4 md:col-span-2">
            <Logo />
            <p className="text-muted-foreground max-w-sm">
              AI-powered app generation platform to bring your ideas to life faster than ever.
            </p>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Company</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary">About Us</Link></li>
              <li><Link href="/pricing" className="text-sm text-muted-foreground hover:text-primary">Pricing</Link></li>
              <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-primary">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary">Terms &amp; Conditions</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary">Privacy Policy</Link></li>
              <li><Link href="/return-policy" className="text-sm text-muted-foreground hover:text-primary">Return Policy</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 flex flex-col items-center justify-between border-t pt-6 sm:flex-row">
          <p className="text-sm text-muted-foreground">
            &copy; {currentYear} Genius APPio. All rights reserved.
          </p>
          <div className="mt-4 flex items-center space-x-2 sm:mt-0">
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="Twitter"><Twitter className="h-4 w-4" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="GitHub"><Github className="h-4 w-4" /></a>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <a href="#" aria-label="LinkedIn"><Linkedin className="h-4 w-4" /></a>
            </Button>
          </div>
        </div>
      </div>
    </footer>
  );
}
