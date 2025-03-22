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

export async function findAllApointments(id: string) {
    console.log("id: ", id);
    return await prisma.appointment.findMany({
        where: {
          patient: {
            userId: id, 
          },
          completed: true,
        },
        include: {
          doctor: {
            select: {
              user: {
                select: { name: true, email: true }, 
              },
            },
          },
          patient: {
            select: {
              user: {
                select: { name: true, email: true }, 
              },
            },
          },
        },
      });
}
function extractTextInsideBraces(input: string): string | null {
    const match = input.match(/\\boxed{([\s\S]*?)}/);
    return match ? match[1].trim() : null;
  }

export async function saveAiSuggestion(text: string) {
    const extractedText = extractTextInsideBraces(text);
    if (extractedText) {
      return await prisma.aiSuggestion.create({
        data: { text: extractedText },
      });
    }
    return await prisma.aiSuggestion.create({
      data: { text },
    });
  }
