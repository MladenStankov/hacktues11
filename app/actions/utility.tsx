"use server"
import prisma from "@/lib/prisma";
import { User } from "@prisma/client";

export async function getDoctor(doctorId: string): Promise< User | null> {
    console.log("In getDoctor: ", doctorId);
    const doctor = await prisma.doctor.findUnique({
        where: { id: doctorId }
    });
    console.log("tuk")
    if (!doctor) {
        return null
    }
    console.log("tam")
    const doctorUser = await prisma.user.findUnique({
        where: { id: doctor.userId }
    });
    console.log("doctorUser: ", doctorUser?.name);

    return doctorUser;
}

export async function findAllAiSuggestions() {
    return await prisma.aiSuggestion.findMany();
}

export async function findAllApointments() {
    return await prisma.appointment.findMany();
}
