import prisma from "@/lib/prisma"


async function fetchAppointmentNotes(appointmentId: string): Promise<string> {
    try {
        const appointment = await prisma.appointment.findUnique({
            where: { id: appointmentId },
            select: { date: true, notes: true }
        })

        if (!appointment || !appointment.notes) {
            console.warn(`No notes found for appointment ID: ${appointmentId}`)
            return ""
        }

        const formattedDate = appointment.date.toISOString().split("T")[0].replace(/-/g, "-")
        return `${formattedDate}: ${appointment.notes}`
    } catch (error) {
        console.error("Error fetching notes from Prisma:", error)
        return ""
    }
}

export async function fetchMultipleAppointmentsNotes(appointmentIds: string[]): Promise<string[]> {
    try {
        return await Promise.all(
            appointmentIds.map(async (id) => await fetchAppointmentNotes(id))
        )
    } catch (error) {
        console.error("Error fetching multiple appointment notes:", error)
        return []
    }
}
