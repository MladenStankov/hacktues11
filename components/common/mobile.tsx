import React from "react";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "../ui/sheet";
import { Menu, X } from "lucide-react";
import { Session } from "@/lib/auth";
import AuthButtons from "./AuthButtons";
import Link from "next/link";

interface IProps {
    session: Session | null;
}

export default function MobileNavigation({ session }: IProps) {
    return (
        <Sheet>
            <SheetTrigger asChild>
                <Menu />
            </SheetTrigger>

            <SheetContent className="w-full [&>button]:hidden min-h-svh h-full">
                <div className="flex justify-between items-center">
                    <SheetHeader>
                        <SheetTitle className="text-2xl">Menu</SheetTitle>
                        <SheetDescription />
                    </SheetHeader>
                    <SheetClose asChild>
                        <X size={40} />
                    </SheetClose>
                </div>
                <div className="h-full flex flex-col gap-4">
                    <div className="flex flex-col gap-6 ml-3">
                        {!session ? (
                            <>
                                <Link
                                    href="/#features"
                                    className="text-lg font-medium hover:text-primary"
                                >
                                    Features
                                </Link>
                                <Link
                                    href="/#about"
                                    className="text-lg font-medium hover:text-primary"
                                >
                                    About Us
                                </Link>
                                <Link
                                    href="/#contact"
                                    className="text-lg font-medium hover:text-primary"
                                >
                                    Contact
                                </Link>
                            </>
                        ) : (
                            <>
                                <Link
                                    href="/dashboard"
                                    className="text-lg font-medium hover:text-primary"
                                >
                                    Dashboard
                                </Link>
                                <Link
                                    href="/appointments"
                                    className="text-lg font-medium hover:text-primary"
                                >
                                    Appointments
                                </Link>
                                <Link
                                    href="/doctors"
                                    className="text-lg font-medium hover:text-primary"
                                >
                                    Doctors
                                </Link>
                            </>
                        )}
                    </div>
                    <div className="gap-6 flex w-full justify-center mt-auto mb-10">
                        <AuthButtons session={session} />
                    </div>
                </div>
            </SheetContent>
        </Sheet>
    );
}