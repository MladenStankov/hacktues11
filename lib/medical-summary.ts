import { fetchMultipleAppointmentsNotes } from "./note-loader"
import prisma from "@/lib/prisma"


export async function fetchAllDiseasesAndAllergies(): Promise<string> {
    try {
        const appointments = await prisma.appointment.findMany({
            select: { id: true },
        })

        const appointmentIds = appointments.map((appointment) => appointment.id)
        return (await fetchMultipleAppointmentsNotes(appointmentIds)).join("\n")
    } catch (error) {
        console.error("Error retrieving diseases and allergies:", error);
        return "Error retrieving medical records.";
    }
}
