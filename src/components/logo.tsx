import Link from "next/link";
import { Hammer, Sparkles } from "lucide-react";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Hammer className="h-5 w-5" />
        <Sparkles className="absolute -top-1 -right-1 h-3 w-3 text-accent" />
      </div>
      <span className="hidden text-xl font-bold font-headline text-foreground sm:inline-block">
        AppForge AI
      </span>
      <span className="sr-only">AppForge AI Home</span>
    </Link>
  );
}
