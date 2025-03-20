import React from "react";
import Link from "next/link";
import { Heart } from "lucide-react"

export default function Footer() {
  return (
    <footer className="w-full border-t bg-background py-6 md:py-8">
        <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
          <div className="flex items-center gap-2">
            <Heart className="h-6 w-6 text-primary" />
            <Link href="/">
              <span className="text-lg font-bold">CareLink</span>
            </Link>
          </div>
          <p className="text-center text-sm text-muted-foreground md:text-left">
            © 2023 CareLink. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-primary">
              Accessibility
            </Link>
          </div>
        </div>
      </footer>
  );
}
