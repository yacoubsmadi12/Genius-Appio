
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Globe, Menu, UserCircle } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useToast } from "@/hooks/use-toast";

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
import { Skeleton } from "./ui/skeleton";

export function SiteHeader() {
  const { user, loading, signOut } = useAuth();
  const router = useRouter();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      await signOut();
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      });
      router.push("/");
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Logout Failed",
        description: "Could not log you out. Please try again.",
      });
    }
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

  const renderUserMenu = () => {
    if (loading) {
      return <Skeleton className="h-8 w-20" />;
    }

    if (user) {
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="gap-2">
              <UserCircle className="h-5 w-5" />
              <span className="hidden md:inline">{user.displayName || "Account"}</span>
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
      );
    }

    return (
      <div className="hidden items-center space-x-2 md:flex">
        <Button asChild variant="ghost">
          <Link href="/login">Login</Link>
        </Button>
        <Button asChild>
          <Link href="/signup">Sign Up</Link>
        </Button>
      </div>
    );
  };


  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex-1 flex justify-center">
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
          
          {renderUserMenu()}

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
                    {user ? (
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
