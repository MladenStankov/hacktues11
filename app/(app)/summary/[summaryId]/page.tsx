import prisma from "@/lib/prisma";

export default async function UserPage({
  params,
}: {
  params: { summaryId: string };
}) {
  const { summaryId } = params;

  try {
    // Fetch the user data using Prisma
    const patient = await prisma.patient.findFirst({
      where: {
        id: summaryId, // Find the user by ID
      },
      include: {
        // Include related Doctor data
        user: true, // Include related Patient data
      },
    });

    if (!patient) {
      return (
        <div>
          <h1>Patient Not Found</h1>
          <p>No patient found with the summary ID: {summaryId}</p>
        </div>
      );
    }

    // Step 2: Extract the User record from the Patient

    return (
      <div>
        <h1>User Information</h1>
        <pre>{JSON.stringify(patient, null, 2)}</pre>
      </div>
    );
  } catch (error) {
    console.error("Error fetching user:", error);
    return (
      <div>
        <h1>Error</h1>
        <p>Failed to fetch user data.</p>
      </div>
    );
  }
}
