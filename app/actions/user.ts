"use server";
import prisma from "@/lib/prisma";

export async function setIdNumber(userId: string, idNumber: string) {
  await prisma.user.update({
    where: { id: userId },
    data: { idNumber },
  });
}
