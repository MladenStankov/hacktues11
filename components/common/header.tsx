import React from "react";
import { Heart } from "lucide-react"
import Link from "next/link";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <div className="container flex h-16 items-center justify-between">
      <div className="flex items-center gap-2">
        <Heart className="h-6 w-6 text-primary" />
        <Link href="/">
          <span className="text-xl font-bold">CareLink</span>
        </Link>
      </div>
      <nav className="hidden md:flex gap-6">
        <Link href="#features" className="text-sm font-medium hover:text-primary">
          Features
        </Link>
        <Link href="#testimonials" className="text-sm font-medium hover:text-primary">
          Testimonials
        </Link>
        <Link href="#about" className="text-sm font-medium hover:text-primary">
          About Us
        </Link>
        <Link href="#contact" className="text-sm font-medium hover:text-primary">
          Contact
        </Link>
      </nav>
      <div className="flex items-center gap-4">
        <Link href="/sign-in">
          <Button variant="outline" size="sm" className="hidden md:flex">
            Log in
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button size="sm">Sign up</Button>
        </Link>
      </div>
    </div>
  );
}
