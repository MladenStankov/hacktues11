import PatientInfoDashboard from "@/components/dashboard/PatientDashboard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  return <PatientInfoDashboard patientId={session?.user?.id}/>
}