"use server"
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export async function getDoctor(doctorId: string): Promise< User | null> {
    const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId }
    });
    if (!doctor) {
        return null
    }
    const doctorUser = await prisma.user.findUnique({
        where: { id: doctor.userId }
    });
    return doctorUser;
}

export async function findAllAiSuggestions() {
    return await prisma.aiSuggestion.findMany();
}

export async function findAllApointments() {
    return await prisma.appointment.findMany();
}
