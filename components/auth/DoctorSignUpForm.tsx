"use client";

import React, { useState } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { doctorSchema, type DoctorSignUpFormValues } from "@/lib/zod-schemas";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  Loader2,
  Eye,
  EyeOff,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Link from "next/link";
import { toast } from "sonner";
import { signUp } from "@/lib/auth-client";
import { createDoctorMetadata } from "@/app/actions/user";
import { DoctorSpecialization } from "@prisma/client";

export default function DoctorSignUpForm() {
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<DoctorSignUpFormValues>({
    resolver: zodResolver(doctorSchema),
    defaultValues: {
      firstName: "",
      middleName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
      uniqueCitizenshipNumber: "",
      specialization: "GENERAL_PRACTITIONER",
      licenseNumber: "",
      hospital: "",
    },
  });

  const handlePrevious = () => {
    setStep(step - 1);
  };

  const handleNext = async () => {
    const fieldsToValidate = {
      1: ["firstName", "lastName"],
      2: [
        "uniqueCitizenshipNumber",
        "licenseNumber",
        "specialization",
        "email",
      ],
      3: ["password", "confirmPassword"],
      4: [],
    }[step] as (keyof DoctorSignUpFormValues)[];

    const isValid = await form.trigger(fieldsToValidate);

    if (isValid) {
      setStep(step + 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return <Step1 form={form} />;
      case 2:
        return <Step2 form={form} />;
      case 3:
        return <Step3 form={form} />;
      case 4:
        return <Step4 form={form} />;
    }
  };

  const handleSubmit = async (data: DoctorSignUpFormValues) => {
    setIsLoading(true);
    try {
      const response = await signUp.email({
        email: data.email,
        password: data.password,
        name: `${data.firstName} ${data.middleName} ${data.lastName}`.trim(),
        callbackURL: "/dashboard",
      });

      if (response.error) {
        toast.error(response.error.message);
      } else {
        await createDoctorMetadata(response.data.user.id, {
          specialization: data.specialization,
          licenseNumber: data.licenseNumber,
          hospital: data.hospital,
          uniqueCitizenshipNumber: data.uniqueCitizenshipNumber,
        });
        setIsSubmitted(true);
      }
    } catch (error) {
      toast.error("Failed to create account");
      console.error(error);
    }
    setIsLoading(false);
  };

  if (isSubmitted) {
    return (
      <div className='flex items-center justify-center h-screen w-full bg-linear-65 from-primary to-primary/40'>
        <Card className="w-full max-w-md mx-auto">
          <CardHeader>
            <CardTitle className="text-center">Registration Complete</CardTitle>
            <CardDescription className="text-center">
              Your doctor account has been successfully created
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center py-10">
            <div className="rounded-full bg-green-100 p-3 mb-4">
              <CheckCircle2 className="h-10 w-10 text-green-600" />
            </div>
            <p className="text-center">
              Thank you for registering! You can verify your email address by
              checking your email
            </p>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => (window.location.href = "/sign-in")}
            >
              Go to Sign In
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className='flex items-center justify-center h-screen w-full bg-linear-65 from-primary to-primary/40'>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="w-full">
          <Card className="w-full max-w-md mx-auto">
            <CardHeader>
              <CardTitle>Create Doctor Account</CardTitle>
              <CardDescription>
                Complete the form below to register. Step {step} of 4.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-between mb-8">
                {[1, 2, 3, 4].map((stepNumber) => (
                  <div key={stepNumber} className="flex flex-col items-center">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${stepNumber === step
                        ? "bg-primary text-primary-foreground"
                        : stepNumber < step
                          ? "bg-primary/20 text-primary"
                          : "bg-muted text-muted-foreground"
                        }`}
                    >
                      {stepNumber < step ? (
                        <CheckCircle2 className="h-5 w-5" />
                      ) : (
                        stepNumber
                      )}
                    </div>
                    <div className="text-xs mt-1">
                      {stepNumber === 1
                        ? "Names"
                        : stepNumber === 2
                          ? "Details"
                          : stepNumber === 3
                            ? "Security"
                            : "Review"}
                    </div>
                  </div>
                ))}
              </div>
              {renderStepContent()}
            </CardContent>
            <CardFooter className="flex justify-between">
              {step > 1 && (
                <Button type="button" variant="outline" onClick={handlePrevious}>
                  <ChevronLeft className="mr-2 h-4 w-4" /> Back
                </Button>
              )}
              {step < 4 ? (
                <Button
                  type="button"
                  className={step === 1 ? "ml-auto" : ""}
                  onClick={handleNext}
                >
                  Next <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={isLoading}
                  onClick={() => handleSubmit(form.getValues())}
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin" />
                  ) : (
                    "Complete Registration"
                  )}
                </Button>
              )}
            </CardFooter>
            <p className="text-sm text-muted-foreground text-center pb-4">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline">
                Sign in
              </Link>
            </p>
          </Card>
        </form>
      </Form>
    </div>
  );
}

function Step1({ form }: { form: UseFormReturn<DoctorSignUpFormValues> }) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>First Name *</FormLabel>
            <FormControl>
              <Input placeholder="Enter your first name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="middleName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Middle Name</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your middle name (optional)"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Last Name *</FormLabel>
            <FormControl>
              <Input placeholder="Enter your last name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function Step2({ form }: { form: UseFormReturn<DoctorSignUpFormValues> }) {
  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="uniqueCitizenshipNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Unique Citizenship Number *</FormLabel>
            <FormControl>
              <Input placeholder="Enter your ID number" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="licenseNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Medical License Number *</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your medical license number"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="specialization"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Specialization *</FormLabel>
            <FormControl>
              <select
                {...field}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2"
              >
                <option value="">Select specialization</option>
                {Object.entries(DoctorSpecialization).map(([key]) => (
                  <option key={key} value={key}>
                    {key
                      .split("_")
                      .map(
                        (word) =>
                          word.charAt(0).toUpperCase() +
                          word.slice(1).toLowerCase()
                      )
                      .join(" ")}
                  </option>
                ))}
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="hospital"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Hospital/Clinic</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter your hospital or clinic name (optional)"
                {...field}
                value={field.value ?? ""}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address *</FormLabel>
            <FormControl>
              <Input
                type="email"
                placeholder="Enter your email address"
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function Step3({ form }: { form: UseFormReturn<DoctorSignUpFormValues> }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <div className="space-y-4">
      <FormField
        control={form.control}
        name="password"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Password *</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a password"
                  {...field}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="confirmPassword"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Confirm Password *</FormLabel>
            <FormControl>
              <div className="relative">
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  {...field}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 flex items-center pr-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <Eye className="h-4 w-4 text-muted-foreground" />
                  )}
                </button>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}

function Step4({ form }: { form: UseFormReturn<DoctorSignUpFormValues> }) {
  const values = form.getValues();

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium">Review Your Information</h3>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p className="text-sm text-muted-foreground">First Name</p>
          <p className="font-medium">{values.firstName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Middle Name</p>
          <p className="font-medium">{values.middleName || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Last Name</p>
          <p className="font-medium">{values.lastName}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">ID Number</p>
          <p className="font-medium">{values.uniqueCitizenshipNumber}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">License Number</p>
          <p className="font-medium">{values.licenseNumber}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Specialization</p>
          <p className="font-medium">
            {values.specialization
              .split("_")
              .map(
                (word) =>
                  word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
              )
              .join(" ")}
          </p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Hospital/Clinic</p>
          <p className="font-medium">{values.hospital || "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-muted-foreground">Email</p>
          <p
            className="font-medium truncate max-w-[150px]"
            title={values.email}
          >
            {values.email}
          </p>
        </div>
      </div>
    </div>
  );
}
