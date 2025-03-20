"use server";
import prisma from "@/lib/prisma";
import { Gender, BloodType } from "@prisma/client";

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
