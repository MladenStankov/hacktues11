import { type BloodType, Gender } from "@prisma/client"


export function formatBloodType(bloodType: BloodType): string {
  const mapping: Record<BloodType, string> = {
    AB_POSITIVE: "AB+",
    AB_NEGATIVE: "AB-",
    A_POSITIVE: "A+",
    A_NEGATIVE: "A-",
    B_POSITIVE: "B+",
    B_NEGATIVE: "B-",
    O_POSITIVE: "O+",
    O_NEGATIVE: "O-",
  }

  return mapping[bloodType] || String(bloodType)
}


export function formatGender(gender: Gender): string {
  return gender === Gender.MALE ? "Male" : "Female"
}


export function calculateBMI(heightCm: number, weightKg: number): { value: number; category: string } {
  
  const heightM = heightCm / 100

  
  const bmi = weightKg / (heightM * heightM)

  
  let category = ""
  if (bmi < 18.5) {
    category = "Underweight"
  } else if (bmi < 25) {
    category = "Normal"
  } else if (bmi < 30) {
    category = "Overweight"
  } else {
    category = "Obese"
  }

  return {
    value: Number.parseFloat(bmi.toFixed(1)),
    category,
  }
}

