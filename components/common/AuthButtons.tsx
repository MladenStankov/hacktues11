import { Session } from "@/lib/auth";
import React from "react";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Skeleton } from "../ui/skeleton";
import Link from "next/link";

export default function AuthButtons({ session }: { session: Session | null }) {
  if (!session)
    return (
      <div className="flex gap-4">
        <Link href="/sign-in">
          <Button
            variant="outline"
            size="sm"
            className="font-semibold text-black"
          >
            Sign In
          </Button>
        </Link>
        <Link href="/sign-up">
          <Button size="sm" className="font-semibold">
            Sign Up
          </Button>
        </Link>
      </div>
    );

  return (
    <Link href="/dashboard" className="flex items-center gap-2">
      <div className="flex items-center gap-2">
        <p className="text-lg font-semibold">{session.user.name}</p>
        <Avatar>
          <AvatarImage
            src={session.user.image ?? "/default_user_image.jpg"}
            alt="User Image"
            className="relative w-full h-full rounded-full"
          />
          <AvatarFallback>
            <Skeleton className="h-full w-full rounded-full" />
          </AvatarFallback>
        </Avatar>
      </div>
    </Link>
  );
}
