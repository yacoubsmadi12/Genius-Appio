"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

const routes = [
  { href: "/", label: "Home" },
  { href: "/pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact Us" },
];

export function MainNav({
  className,
  ...props
}: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();

  return (
    <nav
      className={cn("hidden items-center md:flex", className)}
      {...props}
    >
      <Card className="shadow-sm">
        <div className="flex items-center space-x-2 lg:space-x-4 p-2 rounded-lg">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm font-medium transition-colors hover:bg-muted/50 py-1 px-3 rounded-md",
                pathname === route.href
                  ? "text-primary"
                  : "text-muted-foreground"
              )}
            >
              {route.label}
            </Link>
          ))}
        </div>
      </Card>
    </nav>
  );
}
