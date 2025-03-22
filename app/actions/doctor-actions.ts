"use server";

import prisma from "@/lib/prisma";

export async function getDoctorInfo(doctorId: string) {
  const doctor = await prisma.user.findUnique({
    where: { id: doctorId },
    include: {
      doctor: true,
    },
  });
  return doctor;
}

export async function getDoctorAppointments(doctorId: string) {
  const appointments = await prisma.appointment.findMany({
    where: {
      doctor: {
        userId: doctorId,
      },
    },
    include: {
      patient: {
        include: {
          user: true,
        },
      },
    },
    orderBy: {
      date: "asc",
    },
  });
  return appointments;
}

export async function completeAppointment(
  appointmentId: string,
  xmlData: string
) {
  try {
    const appointment = await prisma.appointment.update({
      where: { id: appointmentId },
      data: {
        completed: true,
        xmlFiles: [xmlData],
      },
    });
    return appointment;
  } catch (error) {
    console.error("Error completing appointment:", error);
    throw new Error("Failed to complete appointment");
  }
}
