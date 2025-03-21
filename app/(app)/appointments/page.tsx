import { AppointmentForm } from "@/components/appointments/appointment-form";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

export default async function AppointmentsPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/signin");
  }

  return (
    <div>
      <div className="container mx-auto py-6 space-y-8">
        <AppointmentForm patientId={session?.user?.id} />
      </div>
    </div>
  );
}
