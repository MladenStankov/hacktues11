"use server"

import prisma from "@/lib/prisma";
import { Appointment } from "@prisma/client"

export type AppointmentCreateData = {
  doctorId: string
  patientId: string
  date: Date
  reason: string
  notes?: string
}

export async function createAppointment(data: AppointmentCreateData) {
  try {
    if (!data.doctorId || !data.patientId || !data.date) {
      return { error: "Missing required fields" }
    }

    const utcDate = new Date(data.date);
    console.log("UTC Date:", utcDate);

    if (isNaN(utcDate.getTime())) {
        return { error: "Invalid date" };
    }


    const appointment = await prisma.appointment.create({
      data: {
        doctorId: data.doctorId,
        patientId: data.patientId,
        date: utcDate,
        reason: data.reason,
        notes: data.notes,
        completed: false,
        xmlFiles: [],
      },
      include: {
        doctor: {
          include: {
            user: true
          }
        }
      }
    })

    return { success: true, appointment }
  } catch (error: any) {
    console.error("Appointment creation error:", error)
    return { error: error.message || "Failed to create appointment" }
  }
}