"use server"

import prisma from "@/lib/prisma"
import { fetchMultipleAppointmentsXMLs } from "@/lib/xml-loader"
import { parseMultipleXML, type MedicalExam } from "@/lib/xml-parser"

export type AppointmentWithDoctor = {
  id: string
  date: Date
  reason: string
  completed: boolean
  notes: string | null
  xmlFiles: string[]
  doctor: {
    id: string
    specialization: string
    user: {
      name: string
    }
  }
}

export async function getPatientInfo(userId: string) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        patient: true,
      },
    })

    if (!user) {
      throw new Error("User not found")
    }

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      image: user.image,
      uniqueCitizenshipNumber: user.uniqueCitizenshipNumber,
      patient: user.patient,
    }
  } catch (error) {
    console.error("Error fetching patient info:", error)
    throw error
  }
}

export async function getPatientAppointments(patientId: string | undefined): Promise<AppointmentWithDoctor[]> {
  if (!patientId) {
    return []
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
    console.error("Error fetching patient appointments:", error)
    throw error
  }
}

export async function getPatientMedicalExams(patientId: string | undefined): Promise<MedicalExam[]> {
  if (!patientId) {
    return []
  }

  try {
    // First get the patient record
    const patient = await prisma.patient.findUnique({
      where: { userId: patientId },
    })

    if (!patient) {
      throw new Error("Patient not found")
    }

    // Get all appointments for this patient
    const appointments = await prisma.appointment.findMany({
      where: {
        patientId: patient.id,
        completed: true, // Only completed appointments have medical exams
        xmlFiles: { isEmpty: false }, // Only appointments with XML files
      },
      select: {
        id: true,
        xmlFiles: true,
      },
    })

    // Get appointment IDs
    const appointmentIds = appointments.map((appointment) => appointment.id)

    // Fetch XML files for these appointments
    const xmlContents = await fetchMultipleAppointmentsXMLs(appointmentIds)

    // Parse XML contents into MedicalExam objects
    const medicalExams = await parseMultipleXML(xmlContents)

    return medicalExams
  } catch (error) {
    console.error("Error fetching patient medical exams:", error)
    throw error
  }
}

