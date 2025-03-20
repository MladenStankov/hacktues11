"use client"

import { makeSuggestion } from '@/app/actions/make-suggestion'
import { Button } from '@/components/ui/button'
import React from 'react'


export default function page() {
    const handleClick = async () => {
        await makeSuggestion()
    }

    return (
        <div>
            <Button onClick={handleClick}>Test AI</Button>
        </div>
    )
}
