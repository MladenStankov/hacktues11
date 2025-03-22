"use client"

import { useState } from "react"
import { PreviousAssessments } from "@/components/ai-suggestions/previous-assesment"
import { AppointmentFilter } from "@/components/ai-suggestions/appointment-filter"
import { SuggestionDisplay } from "@/components/ai-suggestions/suggestion-display"
import { Appointment, AiSuggestion, User } from "@prisma/client";
import { makeSuggestion } from '@/app/actions/make-suggestion'
import { saveAiSuggestion } from "@/app/actions/utility"

interface SuggestionProps {
  userId: string
}

export default function SuggestionsBoard({ userId }: SuggestionProps) {
  const [selectedAppointments, setSelectedAppointments] = useState<Appointment[]>([])
  const [currentReview, setCurrentReview] = useState<AiSuggestion | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateOpinion = async () => {
    if (selectedAppointments.length === 0) return
    console.log("selectedAppointments: ", selectedAppointments)
    const selectedAppointmentIds = selectedAppointments.map((appointment) => appointment.id);

    setIsGenerating(true)
    try {
      console.log("selectedAppointmentIds: ", selectedAppointmentIds)
      const newReview = await makeSuggestion(selectedAppointmentIds);
      console.log("newReview: ", newReview)
      const savedSuggestion = await saveAiSuggestion(newReview);
    
      console.log("savedSuggestion: ", savedSuggestion);
  
      setCurrentReview(savedSuggestion);
    } catch (error) {
      console.error("Failed to generate AI opinion:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleSelectReview = (review: AiSuggestion) => {
    setCurrentReview(review)
    setSelectedAppointments([])
  }

  const handleResetView = () => {
    setCurrentReview(null)
    setSelectedAppointments([])
  }

  return (
    <div className="flex flex-col md:flex-row gap-6 h-[80vh]">
      {/* Left sidebar - Previous assessments */}
      <div className="w-full md:w-1/3 lg:w-1/4 h-full overflow-hidden border rounded-lg shadow-sm">
        <PreviousAssessments onSelectReview={handleSelectReview} />
      </div>

      {/* Right main content area */}
      <div className="w-full md:w-2/3 lg:w-3/4 h-full border rounded-lg shadow-sm overflow-hidden">
        {currentReview ? (
          <SuggestionDisplay review={currentReview} onBack={handleResetView} />
        ) : (
          <AppointmentFilter
            selectedAppointments={selectedAppointments}
            onSelectAppointments={setSelectedAppointments}
            onGenerateOpinion={handleGenerateOpinion}
            isGenerating={isGenerating}
            userId={userId}
          />
        )}
      </div>
    </div>
  )
}

/* */
