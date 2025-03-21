"use client"

import { format } from "date-fns"
import Link from "next/link"
import { CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import type { Doctor } from "./doctor-search"

interface AppointmentConfirmationProps {
  appointmentDetails: {
    date?: Date
    time?: string
    appointmentType?: string
    notes: string
  }
  doctor?: Doctor | null
}

export function AppointmentConfirmation({ appointmentDetails, doctor }: AppointmentConfirmationProps) {
  const { date, time, appointmentType, notes } = appointmentDetails

  const appointmentTypeLabels: Record<string, string> = {
    "general-checkup": "General Check-up",
    "follow-up": "Follow-up Visit",
    consultation: "Consultation",
    vaccination: "Vaccination",
    other: "Other",
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <CardTitle className="text-2xl">Appointment Confirmed</CardTitle>
        <CardDescription>Your appointment has been successfully scheduled.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {doctor && (
            <div className="border rounded-lg p-4 flex items-start gap-4">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Doctor</p>
                <p className="text-lg font-medium">{doctor.name}</p>
                <p className="text-sm">{doctor.specialty}</p>
                <p className="text-sm">{doctor.hospital}</p>
              </div>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4 border rounded-lg p-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-lg font-medium">{date ? format(date, "EEEE, MMMM d, yyyy") : "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Time</p>
              <p className="text-lg font-medium">{time || "Not specified"}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Appointment Type</p>
              <p className="text-lg font-medium">
                {appointmentType ? appointmentTypeLabels[appointmentType] : "Not specified"}
              </p>
            </div>
            {notes && (
              <div className="col-span-2">
                <p className="text-sm font-medium text-muted-foreground">Additional Notes</p>
                <p className="text-sm">{notes}</p>
              </div>
            )}
          </div>

          <div className="bg-muted p-4 rounded-lg">
            <p className="text-sm">
              A confirmation email has been sent to your registered email address. If you need to reschedule or cancel
              your appointment, please contact us at least 24 hours in advance.
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col space-y-2">
        <Button className="w-full" onClick={() => window.location.reload()}>
          Book Another Appointment
        </Button>
        <Link href="/dashboard">
            <Button variant="outline" className="w-full">
            Return to Dashboard
            </Button>
        </Link>
      </CardFooter>
    </Card>
  )
}

