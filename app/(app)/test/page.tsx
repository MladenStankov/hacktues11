"use client"
import { test } from '@/app/actions/suggestions'
import { Button } from '@/components/ui/button'
import React from 'react'


export default function page() {
    const handleClick = async () => {
        await test()
    }

    return (
        <div>
            <Button onClick={handleClick}>Test AI</Button>
        </div>
    )
}