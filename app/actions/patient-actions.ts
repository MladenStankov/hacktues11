"use server"

import prisma from "@/lib/prisma"
import { loadPatientMedicalExams, type MedicalExam } from "@/lib/xml-parser"
import { createExamFromAppointment } from "@/lib/xml-utils"
import type { Appointment, Doctor, Patient, User } from "@prisma/client"

export type AppointmentWithDoctor = Appointment & {
  doctor: Doctor & {
    user: {
      name: string
    }
  }
}

export async function getPatientAppointments(patientId: string): Promise<AppointmentWithDoctor[]> {
  if (!patientId) {
    console.error("getPatientAppointments called with undefined patientId")
    throw new Error("Patient ID is required")
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: patientId,
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    return appointments
  } catch (error) {
    console.error("Failed to fetch patient appointments:", error)
    throw new Error("Failed to fetch patient appointments")
  }
}

export async function getPatientMedicalExams(patientId: string): Promise<MedicalExam[]> {
  if (!patientId) {
    console.error("getPatientMedicalExams called with undefined patientId")
    return []
  }

  try {
    // Method 1: Get exams from XML files in the medical_records directory
    const examsFromDirectory = await loadPatientMedicalExams(patientId)

    // Method 2: Create basic exam objects from completed appointments
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: patientId,
        completed: true,
      },
      include: {
        doctor: {
          include: {
            user: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        date: "desc",
      },
    })

    // Create exam objects from appointments
    const examsFromAppointments = appointments.map((appointment) => createExamFromAppointment(appointment))

    // Combine both sources of exams
    const allExams = [...examsFromDirectory]

    // Add exams from appointments if they don't already exist in the directory exams
    // (avoid duplicates by checking if an exam with the same appointmentId already exists)
    examsFromAppointments.forEach((examFromAppointment) => {
      if (!allExams.some((exam) => exam.appointmentId === examFromAppointment.appointmentId)) {
        allExams.push(examFromAppointment)
      }
    })

    // Sort by date, newest first
    return allExams.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  } catch (error) {
    console.error("Failed to fetch patient medical exams:", error)
    return []
  }
}

export type PatientWithUser = Patient & {
  user: User
}

// Update the getPatientInfo function to validate patientId
export async function getPatientInfo(patientId: string) {
  // Validate patientId
  if (!patientId) {
    console.error("getPatientInfo called with undefined patientId")
    throw new Error("Patient ID is required")
  }

  try {
    console.log(`Attempting to fetch patient with ID: ${patientId}`)

    // First check if the patient exists
    const patient = await prisma.user.findUnique({
      where: {
        id: patientId, // This was undefined before
      },
      include: {patient: true}
    })

    console.log(patient)


    if (!patient) {
      console.error(`Patient with ID ${patientId} not found`)
      throw new Error(`Patient with ID ${patientId} not found`)
    }

    if (!patient) {
      console.error(`Patient with ID ${patientId} exists but could not be fetched with user data`)
      throw new Error("Patient data could not be retrieved")
    }

    console.log(`Successfully fetched patient: ${patient.id}`)
    return patient
  } catch (error) {
    console.error("Failed to fetch patient info:", error)
    if (error instanceof Error) {
      throw new Error(`Failed to fetch patient info: ${error.message}`)
    } else {
      throw new Error("Failed to fetch patient info: Unknown error")
    }
  }
}

