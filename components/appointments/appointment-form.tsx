"use client"

import { useState, useEffect } from "react"
import { CalendarIcon } from "lucide-react"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { TimeSlotPicker } from "./time-slot-picker"
import { AppointmentConfirmation } from "./appointment-confirmation"
import { DoctorSearch } from "./doctor-search"
import { useForm } from "react-hook-form"
import { Doctor, User } from "@prisma/client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { createAppointment } from "@/app/actions/appointment-actions"

const formSchema = z.object({
  date: z.date({
    required_error: "Please select a date",
    invalid_type_error: "That's not a valid date!",
  }),
  time: z.string().min(1, "Please select a time slot"),
  reason: z.string().min(1, "Please select an appointment reason"),
  notes: z.string().optional(),
})

type AppointmentFormValues = z.infer<typeof formSchema>

export function AppointmentForm() {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [appointmentDetails, setAppointmentDetails] = useState<
    (AppointmentFormValues & { doctor?: Doctor & { user: User } }) | null
  >(null)
  const [selectedDoctor, setSelectedDoctor] = useState<(Doctor & { user: User }) | null>(null)
  const [activeTab, setActiveTab] = useState("find-doctor")
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      date: undefined,
      time: "",
      reason: "",
      notes: "",
    },
  })

  // Clear messages after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setSuccessMessage(null)
      setErrorMessage(null)
    }, 5000)
    return () => clearTimeout(timer)
  }, [successMessage, errorMessage])

  async function onSubmit(data: AppointmentFormValues) {
    if (!selectedDoctor) {
      setErrorMessage("Please select a doctor before booking")
      return
    }
  
    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)
  
    try {
      if (!(data.date instanceof Date) || isNaN(data.date.getTime())) {
        throw new Error("Invalid date selected")
      }
  
      const [hours, minutes] = data.time.split(":").map(Number);
      const appointmentDateTime = new Date(data.date);
      appointmentDateTime.setHours(hours, minutes, 0, 0);

      console.log("Final appointment date:", appointmentDateTime);
      if (isNaN(appointmentDateTime.getTime())) {
        throw new Error("Invalid time selected");
      }

      console.log("Final appointment date:", appointmentDateTime)
  
      const patientId = "current_patient_id"
      const result = await createAppointment({
        doctorId: selectedDoctor.id,
        patientId,
        date: appointmentDateTime,
        reason: data.reason,
        notes: data.notes || "",
      })
  
      if (result?.error) {
        throw new Error(result.error)
      }
  
      setAppointmentDetails({ ...data, doctor: selectedDoctor })
      setIsSubmitted(true)
      setSuccessMessage("Your appointment has been successfully scheduled!")
    } catch (error: any) {
      setErrorMessage(error.message || "There was an error booking your appointment")
    } finally {
      setIsSubmitting(false)
    }
  }
  

  function handleDoctorSelect(doctor: Doctor & { user: User }) {
    setSelectedDoctor(doctor)
  }

  function handleContinueToBooking() {
    if (selectedDoctor) {
      setActiveTab("book-appointment")
    }
  }

  if (isSubmitted && appointmentDetails) {
    return <AppointmentConfirmation appointmentDetails={appointmentDetails} doctor={selectedDoctor} />
  }

  return (
    <Card className="max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle>Schedule an Appointment</CardTitle>
        <CardDescription>Find a doctor and book your appointment in two simple steps.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="find-doctor">1. Find a Doctor</TabsTrigger>
            <TabsTrigger value="book-appointment" disabled={!selectedDoctor}>
              2. Book Appointment
            </TabsTrigger>
          </TabsList>

          <TabsContent value="find-doctor" className="space-y-4">
            <DoctorSearch onDoctorSelect={handleDoctorSelect} selectedDoctor={selectedDoctor} />

            {selectedDoctor && (
              <div className="flex justify-end mt-6">
                <Button onClick={handleContinueToBooking}>Continue to Booking</Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="book-appointment">
            {selectedDoctor && (
              <div className="mb-6 p-4 bg-muted rounded-lg flex items-start gap-4">
                <div>
                  <h3 className="font-medium">{selectedDoctor.user.name}</h3>
                  <p className="text-sm text-muted-foreground">{selectedDoctor.specialization}</p>
                  <p className="text-sm">{selectedDoctor.hospital}</p>
                </div>
                <Button variant="outline" size="sm" className="ml-auto" onClick={() => setActiveTab("find-doctor")}>
                  Change
                </Button>
              </div>
            )}

            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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
                                className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}
                              >
                                {field.value ? (
                                  field.value.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
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
                            value={field.value ? field.value.toISOString().split("T")[0] : ""}
                            onChange={(e) => {
                              const selectedDate = e.target.value ? new Date(e.target.value + "T00:00:00Z") : null;
                              if (selectedDate && !isNaN(selectedDate.getTime())) {
                                field.onChange(selectedDate);
                              } else {
                                field.onChange(null);
                              }
                            }}
                          />
                          </PopoverContent>
                        </Popover>
                        <FormDescription>Select a weekday for your appointment.</FormDescription>
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
                          value={field.value}
                          disabled={!form.watch("date")}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a time" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <TimeSlotPicker selectedDate={form.watch("date")} onTimeSelected={field.onChange} />
                          </SelectContent>
                        </Select>
                        <FormDescription>Choose an available time slot.</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Appointment Reason</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select appointment reason" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="general-checkup">General Check-up</SelectItem>
                          <SelectItem value="follow-up">Follow-up Visit</SelectItem>
                          <SelectItem value="consultation">Consultation</SelectItem>
                          <SelectItem value="vaccination">Vaccination</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormDescription>Select the reason for your appointment</FormDescription>
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
                        Optional: Include any symptoms or concerns you&apos;d like to discuss.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  {successMessage && (
                    <div className="p-4 bg-green-100 text-green-800 rounded-md animate-fade-in">
                      {successMessage}
                    </div>
                  )}

                  {errorMessage && (
                    <div className="p-4 bg-red-100 text-red-800 rounded-md animate-fade-in">
                      {errorMessage}
                    </div>
                  )}

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Booking..." : "Book Appointment"}
                  </Button>
                </div>
              </form>
            </Form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}