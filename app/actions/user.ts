"use server";
import prisma from "@/lib/prisma";
import { Gender, BloodType, DoctorSpecialization } from "@prisma/client";

export async function createPatientMetadata(
  userId: string,
  data: {
    dateOfBirth: Date;
    gender: string;
    heightCm: number;
    weightKg: number;
    bloodType: string;
    uniqueCitizenshipNumber: string;
    phoneNumber: string;
  }
) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        uniqueCitizenshipNumber: data.uniqueCitizenshipNumber,
      },
    });
    await prisma.patient.create({
      data: {
        userId,
        dateOfBirth: data.dateOfBirth,
        gender: data.gender as Gender,
        heightCm: data.heightCm,
        weightKg: data.weightKg,
        bloodType: data.bloodType as BloodType,
        phoneNumber: data.phoneNumber,
      },
    });
  } catch (error) {
    console.error("Failed to create patient metadata:", error);
    throw new Error("Failed to create patient metadata");
  }
}

export async function createDoctorMetadata(
  userId: string,
  data: {
    specialization: string;
    licenseNumber: string;
    hospital: string | null | undefined;
    uniqueCitizenshipNumber: string;
  }
) {
  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        uniqueCitizenshipNumber: data.uniqueCitizenshipNumber,
      },
    });

    await prisma.doctor.create({
      data: {
        userId,
        specialization: data.specialization as DoctorSpecialization,
        licenseNumber: data.licenseNumber,
        hospital: data.hospital,
      },
    });
  } catch (error) {
    console.error("Failed to create doctor metadata:", error);
    throw new Error("Failed to create doctor metadata");
  }
}
