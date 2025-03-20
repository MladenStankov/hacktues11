import { z } from "zod";

// First, let's create a single schema for the entire form
export const signUpFormSchema = z
  .object({
    firstName: z.string().min(2, "First name must be at least 2 characters"),
    middleName: z.string().optional().nullable(),
    lastName: z.string().min(2, "Last name must be at least 2 characters"),
    idNumber: z.string().min(5, "ID number must be at least 5 characters"),
    email: z.string().email("Please enter a valid email address"),
    profileImage: z
      .custom<File>(
        (value) => value instanceof File,
        "Please upload a valid file"
      )
      .optional()
      .nullable(),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignUpFormValues = z.infer<typeof signUpFormSchema>;
