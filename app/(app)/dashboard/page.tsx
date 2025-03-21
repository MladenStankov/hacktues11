import PatientInfoDashboard from "@/components/dashboard/PatientDashboard";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

let patientId: string | undefined = ""

export default async function Dashboard() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  patientId = session?.user?.id;
  return <PatientInfoDashboard patientId={patientId}/>
}

