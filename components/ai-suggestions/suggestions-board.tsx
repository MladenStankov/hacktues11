"use client"

import { useState } from "react"
import { PreviousAssessments } from "@/components/ai-suggestions/previous-assesment"
import { AppointmentFilter } from "@/components/ai-suggestions/appointment-filter"
import { SuggestionDisplay } from "@/components/ai-suggestions/suggestion-display"
import { Appointment, AiSuggestion } from "@prisma/client";
import { makeSuggestion } from '@/app/actions/make-suggestion'


export default function SuggestionsBoard() {
  const [selectedAppointments, setSelectedAppointments] = useState<Appointment[]>([])
  const [currentReview, setCurrentReview] = useState<AiSuggestion | null>(null)
  const [isGenerating, setIsGenerating] = useState(false)

  const handleGenerateOpinion = async () => {
    if (selectedAppointments.length === 0) return

    const selectedAppointmentIds = selectedAppointments.map((appointment) => appointment.id);

    setIsGenerating(true)
    try {
      const newReview = await makeSuggestion(selectedAppointmentIds);
      setCurrentReview(newReview)
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
          /> 
        )}
      </div>
    </div>
  )
}

/* */
