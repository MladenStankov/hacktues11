"use server";

import prisma from "@/lib/prisma";
import { DoctorSpecialization } from "@prisma/client"; // Import the enum

// Server action to fetch filtered doctors
export async function filters({
  searchTerm,
  specialization,
  hospital,
}: {
  searchTerm: string;
  specialization: string;
  hospital: string;
}) {
  try {
    // Convert specialization to enum if it's provided
    const specializationFilter = specialization
      ? (specialization as DoctorSpecialization) // Cast to Prisma enum type
      : undefined;

    // Query Prisma with filters
    const doctors = await prisma.doctor.findMany({
      where: {
        user: {
          name: searchTerm ? { contains: searchTerm, mode: "insensitive" } : undefined, // Filter by user name
        }, 
        specialization: specializationFilter,
        hospital: hospital ? { contains: hospital, mode: "insensitive" } : undefined, // Filter by hospital
      },
      include: {
        user: true, // Include related user details
      },
    });

    return doctors || [];
  } catch (error) {
    console.error("Error fetching doctors:", error);
    return [];
  }
}
