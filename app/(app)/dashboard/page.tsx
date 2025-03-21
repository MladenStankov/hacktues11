import PatientInfoDashboard from "@/components/dashboard/PatientDashboard";
import DoctorDashboard from "@/components/dashboard/DoctorDashboard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getUserType } from "@/app/actions/user";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    redirect("/signin");
  }

  const userType = await getUserType(session.user.id);

  if (userType === "PATIENT") {
    return <PatientInfoDashboard patientId={session.user.id} />;
  } else if (userType === "DOCTOR") {
    return <DoctorDashboard doctorId={session.user.id} />;
  }

  return redirect("/signin");
}
