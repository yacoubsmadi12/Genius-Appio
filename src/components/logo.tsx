"use client";

import Link from "next/link";
import { Hammer, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2" prefetch={false}>
      <div className="relative flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
        <Hammer className="h-5 w-5" />
        <motion.div
          animate={{
            scale: [1, 1.2, 1, 1.2, 1],
            rotate: [0, 45, 0, -45, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
            repeatDelay: 1,
          }}
          className="absolute -top-1 -right-1"
        >
          <Sparkles className="h-3 w-3 text-accent" />
        </motion.div>
      </div>
      <span className="hidden text-xl font-bold font-headline text-foreground sm:inline-block">
        Genius APPio
      </span>
      <span className="sr-only">Genius APPio Home</span>
    </Link>
  );
}
