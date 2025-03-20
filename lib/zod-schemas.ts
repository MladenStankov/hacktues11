import { z } from "zod";
import { Gender, BloodType, DoctorSpecialization } from "@prisma/client";

const baseUpFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  middleName: z.string().optional().nullable(),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  uniqueCitizenshipNumber: z
    .string()
    .min(5, "ID number must be at least 5 characters"),
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  confirmPassword: z.string(),
});

export const patientSchema = baseUpFormSchema
  .extend({
    gender: z.nativeEnum(Gender, {
      required_error: "Please select your gender",
    }),
    bloodType: z.nativeEnum(BloodType, {
      required_error: "Please select your blood type",
    }),
    heightCm: z
      .number({
        required_error: "Height is required",
        invalid_type_error: "Height must be a number",
      })
      .min(1, "Height must be greater than 0")
      .max(300, "Height must be less than 300 cm"),
    weightKg: z
      .number({
        required_error: "Weight is required",
        invalid_type_error: "Weight must be a number",
      })
      .min(1, "Weight must be greater than 0")
      .max(500, "Weight must be less than 500 kg"),
    phoneNumber: z
      .string({
        required_error: "Phone number is required",
      })
      .min(10, "Phone number must be at least 10 digits")
      .max(15, "Phone number must be less than 15 digits")
      .regex(/^\+?[0-9]+$/, "Invalid phone number format"),
    dateOfBirth: z.date(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export const doctorSchema = baseUpFormSchema.extend({
  specialization: z.nativeEnum(DoctorSpecialization, {
    required_error: "Please select your specialization",
  }),
  licenseNumber: z.string().min(1, "License number is required"),
  hospital: z.string().optional().nullable(),
});

export const signInFormSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export type SignInFormValues = z.infer<typeof signInFormSchema>;
export type PatientSignUpFormValues = z.infer<typeof patientSchema>;
export type DoctorSignUpFormValues = z.infer<typeof doctorSchema>;
