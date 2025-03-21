import prisma from "@/lib/prisma"


async function getXMLFromUrls(urls: string[]): Promise<string[]> {
    try {
      const xmlContents = await Promise.all(
        urls.map(async (url) => {
          const response = await fetch(url)
          
          if (!response.ok) {
              console.error(`Failed to fetch ${url}: ${response.statusText}`)
              return ""
          }

          return response.text()
        })
      );
  
      return xmlContents
    } catch (error) {
      console.error("Error fetching XML files:", error)
      return []
    }
}

async function fetchAppointmentXMLs(appointmentId: string) {
    try {
      const appointment = await prisma.appointment.findUnique({
        where: { id: appointmentId }
      })
  
      if (!appointment || !appointment.xmlFiles) {
        console.warn("No XML file locations found.")
        return []
      }
  
      return await getXMLFromUrls(appointment.xmlFiles)
    } catch (error) {
      console.error("Error fetching XML URLs from Prisma:", error)
      return []
    }
}

async function fetchMultipleAppointmentsXMLs(appointmentIds: string[]) {
    try {
        const xmlContents = await Promise.all(
            appointmentIds.map(async (id) => await fetchAppointmentXMLs(id))
        )

        return xmlContents.flat()
    } catch (error) {
        console.error("Error fetching multiple appointment XMLs:", error)
        return []
    }
}