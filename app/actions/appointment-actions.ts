"use server";

import prisma from "@/lib/prisma";

export type AppointmentCreateData = {
  doctorId: string;
  patientId: string;
  date: Date;
  reason: string;
  notes?: string;
};

export async function createAppointment(data: AppointmentCreateData) {
  console.log(data);
  try {
    if (!data.doctorId || !data.patientId || !data.date) {
      return { error: "Missing required fields" };
    }

    const appointment = await prisma.appointment.create({
      data: {
        date: data.date,
        reason: data.reason,
        notes: data.notes,
        doctor: {
          connect: { id: data.doctorId },
        },
        patient: {
          connect: { id: data.patientId },
        },
      },
    });

    return { success: true, appointment };
  } catch (error) {
    console.error("Appointment creation error:", error);
    return { error: "Failed to create appointment" };
  }
}
