"use client";

import { useState } from "react";
import { CalendarIcon } from "lucide-react";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { TimeSlotPicker } from "./time-slot-picker";
import { AppointmentConfirmation } from "./appointment-confirmation";
import { DoctorSearch } from "./doctor-search";
import { useForm } from "react-hook-form";
import { Doctor, User } from "@prisma/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "./page-header";

type AppointmentFormValues = {
  date: Date | undefined;
  time: string | undefined;
  appointmentType: string | undefined;
  notes: string;
};

export function AppointmentForm() {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [appointmentDetails, setAppointmentDetails] = useState<
    (AppointmentFormValues & { doctor?: Doctor & { user: User } }) | null
  >(null);
  const [selectedDoctor, setSelectedDoctor] = useState<
    (Doctor & { user: User }) | null
  >(null);
  const [activeTab, setActiveTab] = useState("find-doctor");

  const form = useForm<AppointmentFormValues>({
    defaultValues: {
      date: undefined,
      time: undefined,
      appointmentType: undefined,
      notes: "",
    },
  });

  function onSubmit(data: AppointmentFormValues) {
    console.log({ ...data, doctor: selectedDoctor });
    setAppointmentDetails({ ...data, doctor: selectedDoctor ?? undefined });
    setIsSubmitted(true);
  }

  // This function handles the doctor selection and ensures it has both Doctor and User
  function handleDoctorSelect(doctor: Doctor & { user: User }) {
    setSelectedDoctor(doctor);
  }

  function handleContinueToBooking() {
    if (selectedDoctor) {
      setActiveTab("book-appointment");
    }
  }

  if (isSubmitted && appointmentDetails) {
    return (
      <AppointmentConfirmation
        appointmentDetails={appointmentDetails}
        doctor={selectedDoctor}
      />
    );
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <PageHeader
        title="Book an Appointment"
        description="Schedule a visit with a healthcare professional."
      />

      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger
              value="find-doctor"
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              1. Find a Doctor
            </TabsTrigger>
            <TabsTrigger
              value="book-appointment"
              disabled={!selectedDoctor}
              className="data-[state=active]:bg-primary data-[state=active]:text-white"
            >
              2. Book Appointment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="find-doctor" className="space-y-4">
            {/* Make sure DoctorSearch expects a doctor with both Doctor and User */}
            <DoctorSearch
              onDoctorSelect={handleDoctorSelect}
              selectedDoctor={selectedDoctor}
            />

            {selectedDoctor && (
              <div className="flex justify-end mt-6">
                <Button onClick={handleContinueToBooking}>
                  Continue to Booking
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="book-appointment">
            {selectedDoctor && (
              <div className="mb-6 p-4 bg-muted rounded-lg flex items-start gap-4">
                <div>
                  <h3 className="font-medium">{selectedDoctor.user.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedDoctor.specialization}
                  </p>
                  <p className="text-sm">{selectedDoctor.hospital}</p>
                  <p className="text-xs mt-1">Available: test</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="ml-auto"
                  onClick={() => setActiveTab("find-doctor")}
                >
                  Change
                </Button>
              </div>
            )}

            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  new Date(field.value).toLocaleDateString(
                                    "en-US",
                                    {
                                      year: "numeric",
                                      month: "long",
                                      day: "numeric",
                                    }
                                  )
                                ) : (
                                  <span>Select a date</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Input
                              type="date"
                              {...field}
                              value={
                                field.value instanceof Date
                                  ? field.value.toISOString().split("T")[0]
                                  : ""
                              }
                              onChange={(e) =>
                                field.onChange(new Date(e.target.value))
                              }
                            />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>
                          Select a weekday for your appointment.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!form.watch("date")}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <TimeSlotPicker
                              selectedDate={form.watch("date")}
                              onTimeSelected={field.onChange}
                            />
                          </SelectContent>
                        </Select>
                        <FormDescription>
                          Choose an available time slot.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="appointmentType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Type</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select appointment type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general-checkup">
                            General Check-up
                          </SelectItem>
                          <SelectItem value="follow-up">
                            Follow-up Visit
                          </SelectItem>
                          <SelectItem value="consultation">
                            Consultation
                          </SelectItem>
                          <SelectItem value="vaccination">
                            Vaccination
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>
                        Select the type of appointment you need.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="notes"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Notes</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Please provide any additional information about your visit"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Optional: Include any symptoms or concerns you&apos;d
                        like to discuss.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="w-full">
                  Book Appointment
                </Button>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
