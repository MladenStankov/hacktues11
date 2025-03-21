"use client"

import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ArrowLeft, Printer, Download, Share2 } from "lucide-react"
import { AiSuggestion } from "@prisma/client";

interface SuggestionDisplayProps {
    review: AiSuggestion
    onBack: () => void
}

export function SuggestionDisplay({ review, onBack }: SuggestionDisplayProps) {
    const handlePrint = () => {
        window.print()
    }

    const handleDownload = () => {
        const blob = new Blob([review.text], { type: "text/plain" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `ai-opinion-${review.id}.txt`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)
    }

    return (
        <div className="flex flex-col h-full">
            <div className="p-4 border-b flex justify-between items-center">
                <div className="flex items-center">
                    <Button variant="ghost" size="sm" onClick={onBack} className="mr-2">
                        <ArrowLeft className="h-4 w-4 mr-1" />
                        Back
                    </Button>
                    <div>
                        <h2 className="text-xl font-semibold">AI Medical Opinion</h2>
                        <p className="text-sm text-muted-foreground">
                            Generated on {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={handlePrint}>
                        <Printer className="h-4 w-4 mr-1" />
                        Print
                    </Button>
                    <Button variant="outline" size="sm" onClick={handleDownload}>
                        <Download className="h-4 w-4 mr-1" />
                        Download
                    </Button>
                    <Button variant="outline" size="sm">
                        <Share2 className="h-4 w-4 mr-1" />
                        Share
                    </Button>
                </div>
            </div>

            <ScrollArea className="flex-1 p-6">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-6">
                        <h1 className="text-2xl font-bold mb-2">Medical AI Assessment #{review.id}</h1>
                        <div className="text-sm text-muted-foreground">
                            Generated on {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric"
                            })}
                        </div>
                        <div className="border-b my-4"></div>
                    </div>

                    <div className="prose prose-sm md:prose-base max-w-none">
                        {review.text.split("\n\n").map((paragraph, index) => {
                            if (paragraph.startsWith("# ")) {
                                return (
                                    <h2 key={index} className="text-xl font-bold mt-6 mb-3">
                                        {paragraph.substring(2)}
                                    </h2>
                                )
                            } else if (paragraph.startsWith("## ")) {
                                return (
                                    <h3 key={index} className="text-lg font-bold mt-5 mb-2">
                                        {paragraph.substring(3)}
                                    </h3>
                                )
                            } else if (paragraph.startsWith("- ")) {
                                return (
                                    <ul key={index} className="list-disc pl-5 my-3">
                                        {paragraph.split("\n").map((item, i) => (
                                            <li key={i} className="my-1">
                                                {item.substring(2)}
                                            </li>
                                        ))}
                                    </ul>
                                )
                            } else {
                                return (
                                    <p key={index} className="my-3">
                                        {paragraph}
                                    </p>
                                )
                            }
                        })}
                    </div>

                    <div className="mt-8 p-4 bg-muted rounded-lg">
                        <h3 className="font-medium mb-2">Disclaimer</h3>
                        <p className="text-sm text-muted-foreground">
                            This AI-generated medical opinion is provided for informational purposes only and should not replace
                            professional medical advice. Always consult with qualified healthcare providers regarding any medical
                            conditions or treatments.
                        </p>
                    </div>
                </div>
            </ScrollArea>
        </div>
    )
}

