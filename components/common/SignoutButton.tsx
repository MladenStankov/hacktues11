"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Loader, LogOut } from "lucide-react";

export default function SignoutButton() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSignOut = async () => {
    setIsLoading(true);
    const response = await signOut();
    if (response.error) {
      console.log(response.error);
      setIsLoading(false);
      return;
    }
    setIsLoading(false);
    router.refresh();
  };

  return (
    <Button
      onClick={handleSignOut}
      variant="destructive"
      className="w-full font-semibold"
      disabled={isLoading}
      type="button"
    >
      {isLoading ? (
        <Loader className="animate-spin" />
      ) : (
        <>
          <LogOut /> Sign out
        </>
      )}
    </Button>
  );
}
