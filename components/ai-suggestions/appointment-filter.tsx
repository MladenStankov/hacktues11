"use client";

import { useState, useEffect, use } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { CalendarIcon, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Appointment } from "@prisma/client";
import { getDoctor, findAllApointments } from "@/app/actions/utility";

interface AppointmentFilterProps {
  selectedAppointments: Appointment[];
  onSelectAppointmentsAction: (appointments: Appointment[]) => void;
  onGenerateOpinionAction: () => void;
  isGenerating: boolean;
}

export function AppointmentFilter({
  selectedAppointments,
  onSelectAppointmentsAction,
  onGenerateOpinionAction,
  isGenerating,
}: AppointmentFilterProps) {
    const [appointments, setAppointments] = useState<Appointment[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({
        date: null as Date | null,
        reason: "",
        doctor: "",
    })
    const [doctorNames, setDoctorNames] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const loadAppointments = async () => {
            try {
                const data = await findAllApointments();
                console.log("appointments: ", data);
                // setAppointments(data);
                setAppointments(data);
            } catch (error) {
                console.error("Failed to fetch appointments:", error);
            } finally {
                setLoading(false);
            }
        };
    
        loadAppointments();
    }, []); 
    

    useEffect(() => {
        const fetchDoctorNames = async () => {
            const doctorData: { [key: string]: string } = {};
            for (const appointment of appointments) {
                if (!doctorNames[appointment.doctorId]) { 
                    console.log("app: ", appointment);
                    const doctor = await getDoctor(appointment.doctorId);
                    console.log("doctor: ", doctor);
                    doctorData[appointment.doctorId] = doctor?.name || "Unknown";
                }
            }
            setDoctorNames((prev) => ({ ...prev, ...doctorData }));
        };
    
        if (appointments.length > 0) {
            fetchDoctorNames();
        }
    }, [appointments]);


  const toggleAppointment = (appointment: Appointment) => {
    if (selectedAppointments.some((a) => a.id === appointment.id)) {
      onSelectAppointmentsAction(
        selectedAppointments.filter((a) => a.id !== appointment.id)
      );
    } else {
      onSelectAppointmentsAction([...selectedAppointments, appointment]);
    }
  };

  const clearFilters = () => {
    setFilters({ date: null, reason: "", doctor: "" });
  };

  const uniqueDoctors = [...new Set(appointments.map((a) => a.doctorId))];
  const uniquereasons = [...new Set(appointments.map((a) => a.reason))];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold">Generate New AI Opinion</h2>
        <p className="text-sm text-muted-foreground">
          Select appointments to include in the AI assessment
        </p>
      </div>

      <div className="p-4 border-b flex flex-wrap gap-2 items-center">
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="h-8">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {filters.date
                ? new Date(filters.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                : "Pick date"}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Input
              type="date"
              value={
                filters.date
                  ? new Date(filters.date).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setFilters({ ...filters, date: new Date(e.target.value) })
              }
            />
          </PopoverContent>
        </Popover>

        <div className="relative">
          <Input
            placeholder="Filter by reason"
            value={filters.reason}
            onChange={(e) => setFilters({ ...filters, reason: e.target.value })}
            className="h-8 w-[150px] sm:w-[200px]"
          />
          {filters.reason && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-8 w-8 p-0"
              onClick={() => setFilters({ ...filters, reason: "" })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        <div className="relative">
          <Input
            placeholder="Filter by doctor"
            value={filters.doctor}
            onChange={(e) => setFilters({ ...filters, doctor: e.target.value })}
            className="h-8 w-[150px] sm:w-[200px]"
          />
          {filters.doctor && (
            <Button
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-8 w-8 p-0"
              onClick={() => setFilters({ ...filters, doctor: "" })}
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>

        {(filters.date || filters.reason || filters.doctor) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="h-8"
          >
            Clear filters
          </Button>
        )}
      </div>

      {selectedAppointments.length > 0 && (
        <div className="p-4 border-b bg-muted/50">
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-medium">
              Selected Appointments ({selectedAppointments.length})
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onSelectAppointmentsAction([])}
            >
              Clear all
            </Button>
          </div>
          <div className="flex flex-wrap gap-2">
            {selectedAppointments.map((appointment) => (
              <Badge
                key={appointment.id}
                variant="secondary"
                className="flex items-center gap-1"
              >
                {new Date(appointment.date).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                })}{" "}
                - {appointment.reason}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 ml-1"
                  onClick={() => toggleAppointment(appointment)}
                >
                  <X className="h-3 w-3" />
                </Button>
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <Tabs defaultValue="list" className="h-full flex flex-col">
          <div className="px-4 pt-2">
            <TabsList>
              <TabsTrigger value="list">List View</TabsTrigger>
              <TabsTrigger value="doctors">By Doctor</TabsTrigger>
              <TabsTrigger value="reasons">By reason</TabsTrigger>
            </TabsList>
          </div>

                    <TabsContent value="list" className="flex-1 overflow-hidden mt-0">
                        <ScrollArea className="h-full">
                            {loading ? (
                                <div className="p-4 space-y-4">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <div key={i} className="flex items-center space-x-4">
                                            <Skeleton className="h-4 w-4 rounded-sm" />
                                            <div className="space-y-2 flex-1">
                                                <Skeleton className="h-5 w-3/4" />
                                                <Skeleton className="h-4 w-1/2" />
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : appointments.length === 0 ? (
                                <div className="p-6 text-center">
                                    <p className="text-muted-foreground">No appointments found</p>
                                    <p className="text-sm mt-2">Try adjusting your filters</p>
                                </div>
                            ) : (
                                <div className="p-4 space-y-2">
                                    {appointments.map((appointment) => (
                                        <div
                                            key={appointment?.id}
                                            className={cn(
                                                "flex items-start p-3 rounded-md",
                                                selectedAppointments.some((a) => a.id === appointment?.id)
                                                    ? "bg-primary/10"
                                                    : "hover:bg-accent/50",
                                            )}
                                        >
                                            <Checkbox
                                                id={`appointment-${appointment?.id}`}
                                                checked={selectedAppointments.some((a) => a.id === appointment?.id)}
                                                onCheckedChange={() => toggleAppointment(appointment)}
                                                className="mt-1"
                                            />
                                            <div className="ml-3 flex-1">
                                                <Label htmlFor={`appointment-${appointment?.id}`} className="font-medium cursor-pointer">
                                                    {appointment?.reason}
                                                </Label>
                                                <div className="text-sm text-muted-foreground mt-1">
                                                    <div>Date: {new Date(appointment.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}</div>
                                                    <div>Doctor: {doctorNames[appointment.doctorId] || "Loading..."}</div>  
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="doctors" className="flex-1 overflow-hidden mt-0">
                        <ScrollArea className="h-full">
                            <div className="p-4 space-y-4">
                                {uniqueDoctors.map((doctor) => (
                                    <div key={doctor} className="space-y-2">
                                        <h3 className="font-medium">{doctor}</h3>
                                        <div className="space-y-2 pl-4">
                                            {appointments
                                                .filter((a) => a.doctorId === doctor && appointments.some((fa) => fa.id === a.id))
                                                .map((appointment) => (
                                                    <div
                                                        key={appointment.id}
                                                        className={cn(
                                                            "flex items-start p-2 rounded-md",
                                                            selectedAppointments.some((a) => a.id === appointment.id)
                                                                ? "bg-primary/10"
                                                                : "hover:bg-accent/50",
                                                        )}
                                                    >
                                                        <Checkbox
                                                            id={`doctor-appointment-${appointment.id}`}
                                                            checked={selectedAppointments.some((a) => a.id === appointment.id)}
                                                            onCheckedChange={() => toggleAppointment(appointment)}
                                                            className="mt-1"
                                                        />
                                                        <div className="ml-3">
                                                            <Label
                                                                htmlFor={`doctor-appointment-${appointment.id}`}
                                                                className="font-medium cursor-pointer"
                                                            >
                                                                {appointment.reason}
                                                            </Label>
                                                            <div className="text-sm text-muted-foreground">
                                                                {new Date(appointment.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>

                    <TabsContent value="reasons" className="flex-1 overflow-hidden mt-0">
                        <ScrollArea className="h-full">
                            <div className="p-4 space-y-4">
                                {uniquereasons.map((reason) => (
                                    <div key={reason} className="space-y-2">
                                        <h3 className="font-medium">{reason}</h3>
                                        <div className="space-y-2 pl-4">
                                            {appointments
                                                .filter((a) => a.reason === reason && appointments.some((fa) => fa.id === a.id))
                                                .map((appointment) => (
                                                    <div
                                                        key={appointment.id}
                                                        className={cn(
                                                            "flex items-start p-2 rounded-md",
                                                            selectedAppointments.some((a) => a.id === appointment.id)
                                                                ? "bg-primary/10"
                                                                : "hover:bg-accent/50",
                                                        )}
                                                    >
                                                        <Checkbox
                                                            id={`reason-appointment-${appointment.id}`}
                                                            checked={selectedAppointments.some((a) => a.id === appointment.id)}
                                                            onCheckedChange={() => toggleAppointment(appointment)}
                                                            className="mt-1"
                                                        />
                                                        <div className="ml-3">
                                                            <Label
                                                                htmlFor={`reason-appointment-${appointment.id}`}
                                                                className="font-medium cursor-pointer"
                                                            >
                                                                Dr. {doctorNames[appointment.doctorId] || "Loading..."}
                                                            </Label>
                                                            <div className="text-sm text-muted-foreground">
                                                                {new Date(appointment.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </TabsContent>
                </Tabs>
            </div>

      <div className="p-4 border-t mt-auto">
        <Button
          className="w-full"
          size="lg"
          disabled={selectedAppointments.length === 0 || isGenerating}
          onClick={onGenerateOpinionAction}
        >
          {isGenerating ? "Generating Opinion..." : "Generate AI Opinion"}
        </Button>
        <p className="text-xs text-muted-foreground text-center mt-2">
          {selectedAppointments.length === 0
            ? "Select at least one appointment to generate an opinion"
            : `Using data from ${selectedAppointments.length} appointment${selectedAppointments.length > 1 ? "s" : ""}`}
        </p>
      </div>
    </div>
  );
}
