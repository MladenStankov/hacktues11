import { Button } from '@/components/ui/button'
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@radix-ui/react-dropdown-menu'
import Link from 'next/link'
import React from 'react'

export default function Page() {
    return (
        <div className='flex items-center justify-center h-screen w-full bg-linear-65 from-primary to-primary/40'>
            <Card className="w-full max-w-md mx-auto text-center">
                <CardHeader>
                    <CardTitle className="text-2xl font-bold">Sign Up</CardTitle>
                    <CardDescription className="text-xl mb-2">Join as a patient or a doctor - your journey starts here.</CardDescription>
                    <Link href="/sign-up/patient">
                        <Button type="button" className="w-full bg-primary border-primary border text-xl h-auto py-2">
                            Sign up as Patient
                        </Button>
                    </Link>
                    <div className="flex items-center my-2">
                        <Separator className="flex-1 border-1" />
                        <span className="mx-2 text-sm text-gray-500">or</span>
                        <Separator className="flex-1 border-1" />
                    </div>
                    <Link href="/sign-up/doctor">
                        <Button type="button" variant={'secondary'} className="w-full text-xl h-auto py-2">
                            Sign up as Doctor
                        </Button>
                    </Link>
                </CardHeader>
            </Card>
        </div>
    )
}
