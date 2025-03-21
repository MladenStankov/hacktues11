import React from "react";
import { Heart } from "lucide-react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AuthButtons from "./AuthButtons";
import MobileNavigation from "./mobile";
export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="bg-gray-100 shadow-md">
      <div className="container flex h-16 items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-primary" />
          <Link href="/">
            <span className="text-xl font-bold">CareLink</span>
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          {!session ? (
            <>
              <Link
                href="/#features"
                className="text-sm font-medium hover:text-primary"
              >
                Features
              </Link>
              <Link
                href="/#about"
                className="text-sm font-medium hover:text-primary"
              >
                About Us
              </Link>
              <Link
                href="/#contact"
                className="text-sm font-medium hover:text-primary"
              >
                Contact
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-sm font-medium hover:text-primary"
              >
                Dashboard
              </Link>
              <Link
                href="/appointments"
                className="text-sm font-medium hover:text-primary"
              >
                Appointments
              </Link>
              <Link
                href="/doctors"
                className="text-sm font-medium hover:text-primary"
              >
                Doctors
              </Link>
            </>
          )}
        </nav>
        <div className="md:hidden">
          <MobileNavigation session={session} />
        </div>
        <div className="hidden md:flex gap-6">
          <AuthButtons session={session} />
        </div>
      </div>
    </div>
  );
}
