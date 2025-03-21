import React from "react";
import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <div className="w-full border-t bg-background py-6 md:py-8">
      <div className="container flex flex-col items-center justify-between gap-4 md:flex-row px-4 md:px-6">
        <Link href="/">
          <Image
            src="/logo.svg"
            alt="CareLink"
            width={150}
            height={50}
            className="stroke-white"
          />
        </Link>
        <p className="text-center text-sm text-muted-foreground md:text-left">
          © 2023 CareLink. All rights reserved.
        </p>
        <div className="flex gap-4">
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Privacy Policy
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Terms of Service
          </Link>
          <Link
            href="#"
            className="text-sm text-muted-foreground hover:text-primary"
          >
            Accessibility
          </Link>
        </div>
      </div>
    </div>
  );
}
