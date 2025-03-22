import prisma from "@/lib/prisma"
import { makeSummary } from "@/app/actions/make-summary"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Console } from "console"

type Params = {
  summaryId: string
}

export default async function SummaryPage({ params }: { params: Params }) {
  const { summaryId } = params

  try {
    // Fetch the patient data using Prisma
    const patient = await prisma.patient.findFirst({
      where: {
        summaryId: summaryId,
      },
      include: {
        user: true,
      },
    })

    if (!patient) {
      return (
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">Patient Not Found</h1>
          <p>No patient found with the summary ID: {summaryId}</p>
        </div>
      )
    }

    // Generate the summary
    const summary = await makeSummary(patient.id)
    console.log(typeof summary)
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Patient Summary</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Patient Information Box */}
          <Card>
            <CardHeader>
              <CardTitle>Patient Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-medium">Personal Details</h3>
                  <p>
                    <span className="font-medium">Name:</span> {patient.user.name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {patient.user.email}
                  </p>
                  <p>
                    <span className="font-medium">ID Number:</span>{" "}
                    {patient.user.uniqueCitizenshipNumber || "Not provided"}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {patient.phoneNumber}
                  </p>
                  <p>
                    <span className="font-medium">Date of Birth:</span> {patient.dateOfBirth.toLocaleDateString()}
                  </p>
                  <p>
                    <span className="font-medium">Gender:</span> {patient.gender}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">Medical Information</h3>
                  <p>
                    <span className="font-medium">Blood Type:</span> {patient.bloodType.replace("_", " ")}
                  </p>
                  <p>
                    <span className="font-medium">Height:</span> {patient.heightCm} cm
                  </p>
                  <p>
                    <span className="font-medium">Weight:</span> {patient.weightKg} kg
                  </p>
                  <p>
                    <span className="font-medium">BMI:</span>{" "}
                    {(patient.weightKg / Math.pow(patient.heightCm / 100, 2)).toFixed(1)}
                  </p>
                </div>

                <div>
                  <h3 className="font-medium">System Information</h3>
                  <p>
                    <span className="font-medium">Patient ID:</span> {patient.id}
                  </p>
                  <p>
                    <span className="font-medium">Summary ID:</span> {patient.summaryId}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Text Box */}
          <Card>
            <CardHeader>
              <CardTitle>Medical Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose max-w-none">
                <p className="whitespace-pre-line">{summary}</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    console.error("Error fetching data:", error)
    return (
      <div className="container mx-auto p-6">
        <h1 className="text-2xl font-bold mb-4">Error</h1>
        <p>Failed to fetch patient data or generate summary.</p>
        <p className="text-sm text-muted-foreground mt-2">
          {error instanceof Error ? error.message : "Unknown error occurred"}
        </p>
      </div>
    )
  }
}

