import React from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AuthButtons from "./AuthButtons";
export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="container flex h-16 items-center justify-between p-4">
      <div className="flex items-center gap-2">
        <Heart className="h-6 w-6 text-primary" />
        <span className="text-xl font-bold">CareLink</span>
      </div>
      <nav className="hidden md:flex gap-6">
        <Link
          href="#features"
          className="text-sm font-medium hover:text-primary"
        >
          Features
        </Link>
        <Link
          href="#testimonials"
          className="text-sm font-medium hover:text-primary"
        >
          Testimonials
        </Link>
        <Link href="#about" className="text-sm font-medium hover:text-primary">
          About Us
        </Link>
        <Link
          href="#contact"
          className="text-sm font-medium hover:text-primary"
        >
          Contact
        </Link>
      </nav>
      <AuthButtons session={session} />
    </div>
  );
}
