import { AppointmentForm } from "@/components/appointments/appointment-form";

export default async function AppointmentsPage() {
  return (
    <div>
      <div className="container mx-auto py-6 space-y-8">
        <AppointmentForm />
      </div>
    </div>
  );
}
