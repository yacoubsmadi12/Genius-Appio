"use client";

import Link from "next/link";
import { useState } from "react";
import { Globe, Menu, UserCircle } from "lucide-react";

import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Button } from "@/components/ui/button";
import { Logo } from "./logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "./ui/sheet";

export function SiteHeader() {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Simulate user being logged in

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  const mainNavRoutes = [
    { href: "/", label: "Home" },
    { href: "/pricing", label: "Pricing" },
    { href: "/about", label: "About" },
    { href: "/contact", label: "Contact Us" },
  ];

  const sheetRoutes = [
    ...mainNavRoutes,
  ];


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-6">
          <Logo />
          <MainNav />
        </div>
        <div className="flex items-center justify-end space-x-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <Globe className="h-[1.2rem] w-[1.2rem]" />
                <span className="sr-only">Change language</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>English</DropdownMenuItem>
              <DropdownMenuItem>العربية</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <ThemeToggle />
          {isLoggedIn ? (
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <UserCircle className="h-[1.2rem] w-[1.2rem]" />
                    <span className="sr-only">User menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard">Dashboard</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/account">Account</Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
          ) : (
            <div className="hidden items-center space-x-2 md:flex">
              <Button asChild variant="ghost">
                <Link href="/login">Login</Link>
              </Button>
              <Button asChild>
                <Link href="/signup">Sign Up</Link>
              </Button>
            </div>
          )}
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium mt-8">
                <SheetClose asChild>
                    <Logo />
                </SheetClose>
                {sheetRoutes.map((route) => (
                  <SheetClose asChild key={route.href}>
                    <Link href={route.href} className="text-muted-foreground transition-colors hover:text-foreground">
                      {route.label}
                    </Link>
                  </SheetClose>
                ))}
                 <div className="flex flex-col space-y-2 pt-4 border-t">
                    {isLoggedIn ? (
                      <>
                        <SheetClose asChild>
                          <Link href="/dashboard" className="text-muted-foreground transition-colors hover:text-foreground">Dashboard</Link>
                        </SheetClose>
                        <SheetClose asChild>
                          <Link href="/account" className="text-muted-foreground transition-colors hover:text-foreground">Account</Link>
                        </SheetClose>
                        <Button onClick={handleLogout} variant="outline">Logout</Button>
                      </>
                    ) : (
                      <>
                        <SheetClose asChild>
                            <Button asChild variant="outline">
                            <Link href="/login">Login</Link>
                            </Button>
                        </SheetClose>
                        <SheetClose asChild>
                            <Button asChild>
                            <Link href="/signup">Sign Up</Link>
                            </Button>
                        </SheetClose>
                      </>
                    )}
                  </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
