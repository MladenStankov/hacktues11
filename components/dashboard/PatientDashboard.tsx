"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, FileText, Mail, Phone, User, ClipboardList, Loader2, AlertCircle } from "lucide-react"
import {
  getPatientAppointments,
  getPatientInfo,
  getPatientMedicalExams,
  type AppointmentWithDoctor,
} from "@/app/actions/patient-actions"
import { formatBloodType, formatGender, calculateBMI } from "@/lib/patient-utils"
import type { MedicalExam, MedicalResult } from "@/lib/xml-parser"
import type { Patient } from "@prisma/client"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PatientDashboardProps {
  patientId: string | undefined
}

export default function PatientInfoDashboard({ patientId }: PatientDashboardProps) {
  const [patient, setPatient] = useState<{
    id: string
    name: string
    email: string
    image: string | null
    uniqueCitizenshipNumber: string | null
    patient: Patient | null
  } | null>(null)
  const [appointments, setAppointments] = useState<AppointmentWithDoctor[]>([])
  const [medicalExams, setMedicalExams] = useState<MedicalExam[]>([])
  const [loading, setLoading] = useState({
    patient: true,
    appointments: true,
    exams: true,
  })
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function loadData() {
      if (!patientId) {
        setError("Invalid patient ID")
        setLoading({
          patient: false,
          appointments: false,
          exams: false,
        })
        return
      }

      try {
        setLoading((prev) => ({ ...prev, patient: true }))
        // console.log("Fetching patient info for ID:", patientId);
        const patientData = await getPatientInfo(patientId)
        console.log("Patient data received:", patientData ? "success" : "null")
        setPatient(patientData)
        setLoading((prev) => ({ ...prev, patient: false }))

        setLoading((prev) => ({ ...prev, appointments: true }))
        const appointmentsData = await getPatientAppointments(patientData.patient?.id)
        setAppointments(appointmentsData)
        setLoading((prev) => ({ ...prev, appointments: false }))

        setLoading((prev) => ({ ...prev, exams: true }))
        const examsData = await getPatientMedicalExams(patientId)
        setMedicalExams(examsData)
        setLoading((prev) => ({ ...prev, exams: false }))
      } catch (err) {
        console.error("Error loading patient data:", err)
        setError(err instanceof Error ? err.message : "Failed to load patient data")
        setLoading({
          patient: false,
          appointments: false,
          exams: false,
        })
      }
    }

    loadData()
  }, [patientId])

  if (loading.patient) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading patient data...</span>
      </div>
    )
  }

  if (error || !patient || !patient.patient) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-bold text-destructive">Error</h2>
          <p>{error || "Failed to load patient data"}</p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const calculateAge = (dateOfBirth: Date): number => {
    const today = new Date()
    const birthDate = new Date(dateOfBirth)
    let age = today.getFullYear() - birthDate.getFullYear()
    const m = today.getMonth() - birthDate.getMonth()
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age
  }

  const patientAge = calculateAge(patient.patient.dateOfBirth)

  const bmi = calculateBMI(patient.patient.heightCm, patient.patient.weightKg)

  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-6 md:grid-cols-[350px_1fr]">
        {}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src={patient.image || "/placeholder.svg?height=96&width=96"} alt={patient.name} />
                <AvatarFallback>{patient.name}</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">{patient.name}</h2>
                <p className="text-sm text-muted-foreground">
                  DOB: {new Date(patient.patient.dateOfBirth).toLocaleDateString()} ({patientAge} yrs)
                </p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Demographics</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Gender</div>
                <div>{formatGender(patient.patient.gender)}</div>
                <div className="text-muted-foreground">Blood Type</div>
                <div>{formatBloodType(patient.patient.bloodType)}</div>
                <div className="text-muted-foreground">Height</div>
                <div>
                  {patient.patient.heightCm} cm ({Math.floor(patient.patient.heightCm / 2.54 / 12)}&apos;
                  {Math.round(patient.patient.heightCm / 2.54) % 12}&quot;)
                </div>
                <div className="text-muted-foreground">Weight</div>
                <div>
                  {patient.patient.weightKg} kg ({Math.round(patient.patient.weightKg * 2.20462)} lbs)
                </div>
                <div className="text-muted-foreground">BMI</div>
                <div>
                  {bmi.value} ({bmi.category})
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Contact Information</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>{patient.patient.phoneNumber}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>{patient.email}</span>
                </div>
                {patient.uniqueCitizenshipNumber && (
                  <div className="flex items-start gap-2">
                    <User className="h-3 w-3 text-muted-foreground mt-0.5" />
                    <span>ID: {patient.uniqueCitizenshipNumber}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Full Medical Record
              </Button>
            </div>
          </CardContent>
        </Card>

        {}
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Patient Records</h1>
            <p className="text-sm text-muted-foreground">
              Medical record #{patient.patient.id.substring(0, 8)} • Last updated: {new Date().toLocaleDateString()}
            </p>
          </div>

          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Appointment History
              </TabsTrigger>
              <TabsTrigger value="exams">
                <ClipboardList className="mr-2 h-4 w-4" />
                Medical Exam Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments">
              <AppointmentHistory appointments={appointments} loading={loading.appointments} />
            </TabsContent>

            <TabsContent value="exams">
              <MedicalExamResults exams={medicalExams} loading={loading.exams} />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

interface AppointmentHistoryProps {
  appointments: AppointmentWithDoctor[]
  loading: boolean
}

function AppointmentHistory({ appointments, loading }: AppointmentHistoryProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Previous Appointments</CardTitle>
          <CardDescription>Complete record of past medical visits</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading appointments...</span>
        </CardContent>
      </Card>
    )
  }

  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Previous Appointments</CardTitle>
          <CardDescription>Complete record of past medical visits</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No appointment history found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Previous Appointments</CardTitle>
        <CardDescription>Complete record of past medical visits</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto pr-1">
        <div className="space-y-6">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="rounded-md border">
              <div className="border-b bg-muted/40 px-4 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{new Date(appointment.date).toLocaleDateString()}</span>
                    <span className="text-sm text-muted-foreground">
                      <Clock className="mr-1 inline-block h-3 w-3" />
                      {new Date(appointment.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </span>
                  </div>
                  <Badge variant={appointment.completed ? "outline" : "default"}>
                    {appointment.completed ? "Completed" : "Scheduled"}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <div className="font-medium">{appointment.doctor.user.name}</div>
                  <div className="text-sm text-muted-foreground">{appointment.doctor.specialization}</div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Reason for Visit</div>
                    <div className="text-sm">{appointment.reason}</div>
                  </div>
                  {appointment.notes && (
                    <div>
                      <div className="text-sm font-medium">Notes</div>
                      <div className="text-sm">{appointment.notes}</div>
                    </div>
                  )}
                  {appointment.completed && (
                    <div>
                      <div className="text-sm font-medium">Medical Results</div>
                      <div className="text-sm">
                        <Badge variant="secondary" className="mt-1">
                          <FileText className="mr-1 h-3 w-3" />
                          Results Available
                        </Badge>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Download Appointment History
        </Button>
      </CardFooter>
    </Card>
  )
}

interface MedicalExamResultsProps {
  exams: MedicalExam[]
  loading: boolean
}

function MedicalExamResults({ exams, loading }: MedicalExamResultsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical Exam Results</CardTitle>
          <CardDescription>Laboratory tests and diagnostic results</CardDescription>
        </CardHeader>
        <CardContent className="flex h-[400px] items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <span className="ml-2">Loading medical exams...</span>
        </CardContent>
      </Card>
    )
  }

  if (exams.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Medical Exam Results</CardTitle>
          <CardDescription>Laboratory tests and diagnostic results</CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No medical exam results found.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Exam Results</CardTitle>
        <CardDescription>Laboratory tests and diagnostic results</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto pr-1">
        <div className="space-y-6">
          {exams.map((exam) => (
            <div key={exam.id} className="rounded-md border">
              <div className="border-b bg-muted/40 px-4 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{new Date(exam.date).toLocaleDateString()}</span>
                  </div>
                  <Badge variant="outline">{exam.type}</Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <div className="font-medium">{exam.orderedBy.name}</div>
                  <div className="text-sm text-muted-foreground">{exam.orderedBy.department}</div>
                </div>
                <div className="space-y-2">
                  {exam.results.length > 0 ? (
                    <div>
                      <div className="text-sm font-medium">Results</div>
                      <div className="mt-2 space-y-2">
                        {exam.results.map((result, idx) => (
                          <ResultRow key={result.id || idx} result={result} />
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="text-sm text-muted-foreground">No detailed results available</div>
                  )}
                  <div>
                    <div className="text-sm font-medium">Notes</div>
                    <div className="text-sm">{exam.notes}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Download Medical Exam Results
        </Button>
      </CardFooter>
    </Card>
  )
}

interface ResultRowProps {
  result: MedicalResult
}

function ResultRow({ result }: ResultRowProps) {
  const isAbnormal = result.isAbnormal

  return (
    <TooltipProvider>
      <div className="grid grid-cols-5 gap-2 text-sm">
        <div className="font-medium">{result.name}</div>
        <div className={isAbnormal ? "text-destructive font-medium" : ""}>
          {result.value} {result.unit}
        </div>
        <div>
          <Badge variant={isAbnormal ? "destructive" : "outline"} className="text-xs">
            {result.status}
          </Badge>
          {isAbnormal && (
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertCircle className="h-3 w-3 text-destructive ml-1 inline cursor-help" />
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  {result.status.includes("High")
                    ? "Above normal range"
                    : result.status.includes("Low")
                      ? "Below normal range"
                      : "Abnormal result"}
                </p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
        <div className="text-muted-foreground col-span-2">{result.range}</div>
      </div>
    </TooltipProvider>
  )
}

