import { AppointmentForm } from "@/components/appointments/appointment-form"
import { PageHeader } from "@/components/appointments/page-header"

export default function AppointmentsPage() {
  return (
    <div className="container mx-auto py-6 space-y-8">
      <PageHeader
        title="Book an Appointment"
        description="Schedule a visit with a healthcare professional."
      />
      <AppointmentForm />
    </div>
  )
}

