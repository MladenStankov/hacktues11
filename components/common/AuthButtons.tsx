import { Session } from "@/lib/auth";
import React from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Lock } from "lucide-react";
import { Skeleton } from "../ui/skeleton";
import { PopoverClose } from "@radix-ui/react-popover";
import SignoutButton from "./SignoutButton";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button>Sign Up</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="space-y-1 w-fit flex flex-col p-2">
            <DropdownMenuItem className="p-0">
              <Button variant="ghost" asChild>
                <Link href="/sign-up/patient">Sign Up as Patient</Link>
              </Button>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="p-0">
              <Button variant="ghost" asChild>
                <Link href="/sign-up/doctor">Sign Up as Doctor</Link>
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );

  return (
    <Popover modal={true}>
      <PopoverTrigger className="flex items-center gap-2">
        <p>{session.user.name}</p>
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
      </PopoverTrigger>
      <PopoverContent className="space-y-4">
        <div className="flex gap-4">
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

          <div>
            <p className="font-semibold">{session.user.name}</p>
            <p className="text-sm text-muted-foreground">
              {session.user.email}
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {session.user.role === "admin" && (
            <Link href="/admin/dashboard" className="">
              <PopoverClose asChild>
                <Button className="w-full font-semibold">
                  <Lock />
                  Admin Dashboard
                </Button>
              </PopoverClose>
            </Link>
          )}
          <SignoutButton />
        </div>
      </PopoverContent>
    </Popover>
  );
}
