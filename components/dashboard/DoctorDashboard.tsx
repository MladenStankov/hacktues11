"use client";

import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Calendar,
  Clock,
  Mail,
  User,
  Loader2,
  CheckCircle,
} from "lucide-react";
import SignoutButton from "../common/SignoutButton";
import {
  getDoctorInfo,
  getDoctorAppointments,
  completeAppointment,
} from "@/app/actions/doctor-actions";
import { Appointment } from "@prisma/client";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { UploadButton } from "@/app/actions/uploadthing";

interface DoctorDashboardProps {
  doctorId: string;
}

interface DoctorWithUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  doctor: {
    id: string;
    licenseNumber: string;
    specialization: string;
    hospital: string | null;
  } | null;
}

interface AppointmentWithPatient extends Appointment {
  patient: {
    user: {
      name: string;
    };
  };
}

interface AppointmentsListProps {
  appointments: AppointmentWithPatient[];
  onComplete?: (id: string) => void;
  type: "upcoming" | "past";
}

function formatSpecialization(specialization: string): string {
  return specialization
    .split("_")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

export default function DoctorDashboard({ doctorId }: DoctorDashboardProps) {
  const [doctor, setDoctor] = useState<DoctorWithUser | null>(null);
  const [appointments, setAppointments] = useState<AppointmentWithPatient[]>(
    []
  );
  const [loading, setLoading] = useState({
    doctor: true,
    appointments: true,
  });
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(
    null
  );
  const [xmlData, setXmlData] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleCompleteAppointment = async (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    setIsDialogOpen(true);
    setUploadSuccess(false);
  };

  const handleSubmitCompletion = async () => {
    if (!selectedAppointment || !xmlData) return;

    try {
      await completeAppointment(selectedAppointment, xmlData);
      const updatedAppointments = await getDoctorAppointments(doctorId);
      setAppointments(updatedAppointments);
      setIsDialogOpen(false);
      setXmlData("");
      setSelectedAppointment(null);
      setUploadSuccess(false);
    } catch (error) {
      console.error("Error completing appointment:", error);
    }
  };

  useEffect(() => {
    async function loadData() {
      try {
        const [doctorData, appointmentsData] = await Promise.all([
          getDoctorInfo(doctorId),
          getDoctorAppointments(doctorId),
        ]);
        console.log("Loaded appointments:", appointmentsData);
        setDoctor(doctorData);
        setAppointments(appointmentsData);
      } catch (error) {
        console.error("Error loading doctor data:", error);
      } finally {
        setLoading({
          doctor: false,
          appointments: false,
        });
      }
    }

    loadData();
  }, [doctorId]);

  if (loading.doctor) {
    return (
      <div className="flex h-[600px] w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="ml-2">Loading doctor data...</span>
      </div>
    );
  }

  return (
    <>
      <div className="container mx-auto py-6">
        <div className="grid gap-6 md:grid-cols-[350px_1fr]">
          {/* Doctor Info Card */}
          <Card>
            <CardHeader>
              <CardTitle>Doctor Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-col items-center space-y-2">
                <Avatar className="h-24 w-24">
                  <AvatarImage
                    src={doctor?.image || "/default_user_image.jpg"}
                  />
                  <AvatarFallback>{doctor?.name}</AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h2 className="text-xl font-bold">Dr. {doctor?.name}</h2>
                  <Badge variant="secondary" className="text-sm">
                    {doctor?.doctor?.specialization
                      ? formatSpecialization(doctor.doctor.specialization)
                      : "No Specialization"}
                  </Badge>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">Professional Info</span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">License Number</div>
                  <div>{doctor?.doctor?.licenseNumber}</div>
                  <div className="text-muted-foreground">Hospital</div>
                  <div>{doctor?.doctor?.hospital || "Not specified"}</div>
                </div>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">
                    Contact Information
                  </span>
                </div>
                <div className="space-y-1 text-sm">
                  <div className="flex items-center gap-2">
                    <Mail className="h-3 w-3 text-muted-foreground" />
                    <span>{doctor?.email}</span>
                  </div>
                </div>
              </div>

              <SignoutButton />
            </CardContent>
          </Card>

          {/* Appointments Section */}
          <div className="space-y-6">
            <Tabs defaultValue="upcoming" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="upcoming">
                  Upcoming Appointments
                </TabsTrigger>
                <TabsTrigger value="past">Past Appointments</TabsTrigger>
              </TabsList>

              <TabsContent value="upcoming">
                <AppointmentsList
                  appointments={appointments.filter((app) => !app.completed)}
                  onComplete={handleCompleteAppointment}
                  type="upcoming"
                />
              </TabsContent>

              <TabsContent value="past">
                <AppointmentsList
                  appointments={appointments.filter((app) => app.completed)}
                  type="past"
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Complete Appointment</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Please upload the medical examination XML file to complete this
                appointment.
              </p>
              <div className="flex flex-col items-center gap-4 p-4 border rounded-lg">
                <UploadButton
                  className="ut-button:bg-primary ut-button:text-white ut-button:hover:bg-primary/90"
                  endpoint="xmlUploader"
                  onClientUploadComplete={(res) => {
                    console.log("res", res);
                    if (res?.[0]?.url) {
                      setXmlData(res[0].url);
                      setUploadSuccess(true);
                    }
                  }}
                  onUploadError={(error: Error) => {
                    console.error("Upload error:", error);
                    alert(`Upload failed: ${error.message}`);
                  }}
                />
                {uploadSuccess && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="h-4 w-4" />
                    File uploaded successfully
                  </div>
                )}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setIsDialogOpen(false);
                setUploadSuccess(false);
                setXmlData("");
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSubmitCompletion}
              disabled={!xmlData}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-4 w-4" />
              Complete Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AppointmentsList({
  appointments,
  onComplete,
  type,
}: AppointmentsListProps) {
  if (appointments.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>
            {type === "upcoming" ? "Upcoming" : "Past"} Appointments
          </CardTitle>
          <CardDescription>
            {type === "upcoming"
              ? "Scheduled appointments with patients"
              : "Completed appointments history"}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">No appointments found.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {type === "upcoming" ? "Upcoming" : "Past"} Appointments
        </CardTitle>
        <CardDescription>
          {type === "upcoming"
            ? "Scheduled appointments with patients"
            : "Completed appointments history"}
        </CardDescription>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto">
        <div className="space-y-4">
          {appointments.map((appointment) => (
            <div key={appointment.id} className="rounded-md border p-4">
              <div className="flex justify-between items-center mb-2">
                <div>
                  <h3 className="font-medium">
                    {appointment.patient.user.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(appointment.date).toLocaleDateString()}
                    </span>
                    <Clock className="h-4 w-4 ml-2" />
                    <span>
                      {new Date(appointment.date).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
                {type === "upcoming" && onComplete && (
                  <Button
                    onClick={() => onComplete(appointment.id)}
                    variant="outline"
                    size="sm"
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Complete
                  </Button>
                )}
              </div>
              <p className="text-sm">{appointment.reason}</p>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
