"use client"

import { useState, useEffect } from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { AiSuggestion } from "@prisma/client";
import { findAllAiSuggestions } from "@/app/actions/utility"

interface PreviousAssessmentsProps {
    onSelectReview: (review: AiSuggestion) => void
}

export function PreviousAssessments({ onSelectReview }: PreviousAssessmentsProps) {
    const [reviews, setReviews] = useState<AiSuggestion[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadReviews = async () => {
            try {
                const data = await findAllAiSuggestions()
                setReviews(data)
            } catch (error) {
                console.error("Failed to fetch reviews:", error)
            } finally {
                setLoading(false)
            }
        }

        loadReviews()
    }, [])

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b">
                <h2 className="text-xl font-semibold">Previous Assessments</h2>
                <p className="text-sm text-muted-foreground">{reviews.length} AI opinions generated</p>
            </div>

            <ScrollArea className="flex-1">
                {loading ? (
                    <div className="p-4 space-y-4">
                        {Array.from({ length: 5 }).map((_, i) => (
                            <div key={i} className="space-y-2">
                                <Skeleton className="h-5 w-3/4" />
                                <Skeleton className="h-4 w-1/2" />
                                <Skeleton className="h-20 w-full" />
                            </div>
                        ))}
                    </div>
                ) : reviews.length === 0 ? (
                    <div className="p-6 text-center">
                        <p className="text-muted-foreground">No previous assessments found</p>
                        <p className="text-sm mt-2">Generate your first AI opinion to see it here</p>
                    </div>
                ) : (
                    <div className="p-4 space-y-4">
                        {reviews.map((review) => (
                            <Card
                                key={review.id}
                                className="cursor-pointer hover:bg-accent/50 transition-colors"
                                onClick={() => onSelectReview(review)}
                            >
                                <CardHeader className="p-4 pb-2">
                                    <CardTitle className="text-base">AI Assessment #{review.id}</CardTitle>
                                    <CardDescription>
                                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric"
                                        })}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="p-4 pt-0">
                                    <p className="text-sm line-clamp-3">{review.text.substring(0, 150)}...</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </ScrollArea>
        </div>
    )
}

