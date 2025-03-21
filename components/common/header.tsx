import React from "react";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import AuthButtons from "./AuthButtons";
import MobileNavigation from "./mobile";
import Image from "next/image";
export default async function Header() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return (
    <div className="bg-linear-65 from-primary to-primary/80 backdrop-blur-xl  shadow-md text-amber-50 fixed top-0 w-full z-10">
      <div className="container flex h-16 items-center justify-between p-4">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Image
              src="/logo.svg"
              alt="CareLink"
              width={150}
              height={50}
              className="stroke-white invert-100"
            />
          </Link>
        </div>

        <nav className="hidden md:flex gap-6 items-center">
          {!session ? (
            <>
              <Link
                href="/#features"
                className="text-lg font-medium hover:underline underline-offset-4"
              >
                Features
              </Link>
              <Link
                href="/#about"
                className="text-lg font-medium  hover:underline underline-offset-4"
              >
                About Us
              </Link>
              <Link
                href="/#contact"
                className="text-lg font-medium  hover:underline underline-offset-4"
              >
                Contact
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/dashboard"
                className="text-lg font-medium  hover:underline underline-offset-4"
              >
                Dashboard
              </Link>
              <Link
                href="/appointments"
                className="text-lg font-medium  hover:underline underline-offset-4"
              >
                Appointments
              </Link>
              <Link
                href="/ai-suggestions"
                className="text-lg font-medium  hover:underline underline-offset-4"
              >
                AI Suggestions
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
