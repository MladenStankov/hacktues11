import { Mail } from "lucide-react";
import React from "react";
import { Tailwind, Button, Link } from "@react-email/components";

export default function EmailVerificationTemplate({ url }: { url: string }) {
  return (
    <Tailwind>
      <div className="flex flex-col items-center justify-center p-6 max-w-2xl mx-auto">
        <div className="w-full border rounded-lg overflow-hidden bg-white">
          <div className="p-6 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                <span className="font-medium">Verify Your Email Address</span>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div className="flex justify-center py-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Mail className="h-6 w-6 text-primary" />
              </div>
            </div>

            <div className="space-y-4">
              <h1 className="text-xl font-bold text-center">
                Verify Your Email Address
              </h1>

              <p className="text-center text-muted-foreground">
                Thanks for signing up! Please verify your email address to get
                started.
              </p>

              <Button className="px-8">
                <Link href={url}>Verify Email Address</Link>
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                If you didn&apos;t create an account with CareLink, you can
                safely ignore this email.
              </p>
            </div>
          </div>

          <div className="p-6 border-t bg-gray-50 text-center">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} CareLink. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </Tailwind>
  );
}
