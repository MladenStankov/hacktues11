"use client"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calendar, Clock, FileText, Mail, MapPin, Phone, User, ClipboardList } from "lucide-react"

export default function PatientInfoDashboard() {
  // State removed as it's not being used

  return (
    <div className="container mx-auto py-6">
      <div className="grid gap-6 md:grid-cols-[350px_1fr]">
        {/* Patient Information Card */}
        <Card>
          <CardHeader>
            <CardTitle>Patient Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-2">
              <Avatar className="h-24 w-24">
                <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Patient" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="text-center">
                <h2 className="text-xl font-bold">John Doe</h2>
                <p className="text-sm text-muted-foreground">DOB: 05/12/1975 (50 yrs)</p>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Demographics</span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="text-muted-foreground">Gender</div>
                <div>Male</div>
                <div className="text-muted-foreground">Blood Type</div>
                <div>O+</div>
                <div className="text-muted-foreground">Height</div>
                <div>5&apos;10&quot; (178 cm)</div>
                <div className="text-muted-foreground">Weight</div>
                <div>180 lbs (81.6 kg)</div>
                <div className="text-muted-foreground">BMI</div>
                <div>25.8 (Overweight)</div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Contact Information</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2">
                  <Phone className="h-3 w-3 text-muted-foreground" />
                  <span>(555) 123-4567</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="h-3 w-3 text-muted-foreground" />
                  <span>john.doe@example.com</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-3 w-3 text-muted-foreground mt-0.5" />
                  <span>
                    123 Main Street, Apt 4B
                    <br />
                    New York, NY 10001
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm font-medium">Insurance</span>
              </div>
              <div className="space-y-1 text-sm">
                <div className="grid grid-cols-2 gap-1">
                  <div className="text-muted-foreground">Provider</div>
                  <div>HealthPlus Insurance</div>
                  <div className="text-muted-foreground">Policy Number</div>
                  <div>HP-12345678</div>
                  <div className="text-muted-foreground">Group Number</div>
                  <div>GRP-987654</div>
                  <div className="text-muted-foreground">Effective Date</div>
                  <div>01/01/2025</div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <Button variant="outline" className="w-full">
                <FileText className="mr-2 h-4 w-4" />
                Full Medical Record
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Right Section with Tabs */}
        <div className="space-y-6">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight">Patient Records</h1>
            <p className="text-sm text-muted-foreground">Medical record #MR-12345 • Last updated: March 20, 2025</p>
          </div>

          <Tabs defaultValue="appointments" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="appointments">
                <Calendar className="mr-2 h-4 w-4" />
                Appointment History
              </TabsTrigger>
              <TabsTrigger value="exams">
                <ClipboardList className="mr-2 h-4 w-4" />
                Medical Exam Results
              </TabsTrigger>
            </TabsList>

            <TabsContent value="appointments">
              <AppointmentHistory />
            </TabsContent>

            <TabsContent value="exams">
              <MedicalExamResults />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

function AppointmentHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Previous Appointments</CardTitle>
        <CardDescription>Complete record of past medical visits</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto pr-1">
        <div className="space-y-6">
          {[
            {
              date: "March 15, 2025",
              time: "10:30 AM",
              doctor: "Dr. Sarah Johnson",
              department: "Cardiology",
              reason: "Annual checkup and cardiovascular assessment",
              notes: "Blood pressure slightly elevated. Recommended continued medication and follow-up in 3 months.",
              status: "Completed",
            },
            {
              date: "February 2, 2025",
              time: "2:15 PM",
              doctor: "Dr. Michael Chen",
              department: "Internal Medicine",
              reason: "Flu symptoms and persistent cough",
              notes:
                "Diagnosed with seasonal influenza. Prescribed antiviral medication and recommended rest and hydration.",
              status: "Completed",
            },
            {
              date: "December 10, 2024",
              time: "9:00 AM",
              doctor: "Dr. Emily Rodriguez",
              department: "Orthopedics",
              reason: "Knee pain evaluation",
              notes: "MRI showed minor meniscus tear. Recommended physical therapy and follow-up in 6 weeks.",
              status: "Completed",
            },
            {
              date: "October 5, 2024",
              time: "11:45 AM",
              doctor: "Dr. Sarah Johnson",
              department: "Cardiology",
              reason: "Routine follow-up",
              notes: "Blood pressure well-controlled. Continued current medication regimen.",
              status: "Completed",
            },
            {
              date: "August 18, 2024",
              time: "3:30 PM",
              doctor: "Dr. James Wilson",
              department: "Endocrinology",
              reason: "Diabetes management",
              notes: "HbA1c improved to 6.4%. Adjusted medication dosage and recommended continued dietary changes.",
              status: "Completed",
            },
            {
              date: "June 22, 2024",
              time: "10:00 AM",
              doctor: "Dr. Lisa Thompson",
              department: "Ophthalmology",
              reason: "Annual eye exam",
              notes: "No signs of diabetic retinopathy. Updated prescription for reading glasses.",
              status: "Completed",
            },
          ].map((appointment, index) => (
            <div key={index} className="rounded-md border">
              <div className="border-b bg-muted/40 px-4 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{appointment.date}</span>
                    <span className="text-sm text-muted-foreground">
                      <Clock className="mr-1 inline-block h-3 w-3" />
                      {appointment.time}
                    </span>
                  </div>
                  <Badge variant={appointment.status === "Completed" ? "outline" : "default"}>
                    {appointment.status}
                  </Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <div className="font-medium">{appointment.doctor}</div>
                  <div className="text-sm text-muted-foreground">{appointment.department}</div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Reason for Visit</div>
                    <div className="text-sm">{appointment.reason}</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Notes</div>
                    <div className="text-sm">{appointment.notes}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Download Appointment History
        </Button>
      </CardFooter>
    </Card>
  )
}

function MedicalExamResults() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Medical Exam Results</CardTitle>
        <CardDescription>Laboratory tests and diagnostic results</CardDescription>
      </CardHeader>
      <CardContent className="max-h-[600px] overflow-y-auto pr-1">
        <div className="space-y-6">
          {[
            {
              date: "March 15, 2025",
              type: "Blood Panel",
              orderedBy: "Dr. Sarah Johnson",
              department: "Cardiology",
              results: [
                { name: "Cholesterol (Total)", value: "210 mg/dL", status: "High", range: "< 200 mg/dL" },
                { name: "HDL Cholesterol", value: "55 mg/dL", status: "Normal", range: "> 40 mg/dL" },
                { name: "LDL Cholesterol", value: "135 mg/dL", status: "High", range: "< 100 mg/dL" },
                { name: "Triglycerides", value: "150 mg/dL", status: "Normal", range: "< 150 mg/dL" },
              ],
              notes: "Elevated LDL levels. Recommended dietary changes and follow-up in 3 months.",
            },
            {
              date: "February 2, 2025",
              type: "Chest X-Ray",
              orderedBy: "Dr. Michael Chen",
              department: "Internal Medicine",
              results: [
                { name: "Findings", value: "No acute cardiopulmonary process", status: "Normal", range: "N/A" },
              ],
              notes: "No evidence of pneumonia. Lungs clear.",
            },
            {
              date: "December 10, 2024",
              type: "MRI - Right Knee",
              orderedBy: "Dr. Emily Rodriguez",
              department: "Orthopedics",
              results: [
                { name: "Meniscus", value: "Small tear in medial meniscus", status: "Abnormal", range: "N/A" },
                { name: "ACL/PCL", value: "Intact", status: "Normal", range: "N/A" },
                { name: "MCL/LCL", value: "Intact", status: "Normal", range: "N/A" },
                { name: "Joint Effusion", value: "Minimal", status: "Normal", range: "N/A" },
              ],
              notes: "Small medial meniscus tear. Conservative management recommended with physical therapy.",
            },
            {
              date: "August 18, 2024",
              type: "Diabetes Panel",
              orderedBy: "Dr. James Wilson",
              department: "Endocrinology",
              results: [
                { name: "HbA1c", value: "6.4%", status: "Elevated", range: "< 5.7%" },
                { name: "Fasting Glucose", value: "115 mg/dL", status: "Elevated", range: "70-99 mg/dL" },
                { name: "Insulin", value: "12 μIU/mL", status: "Normal", range: "2-20 μIU/mL" },
              ],
              notes:
                "Improved from previous values. Continue current management plan with minor medication adjustment.",
            },
            {
              date: "June 22, 2024",
              type: "Eye Examination",
              orderedBy: "Dr. Lisa Thompson",
              department: "Ophthalmology",
              results: [
                { name: "Visual Acuity (Right)", value: "20/30", status: "Mild Impairment", range: "20/20" },
                { name: "Visual Acuity (Left)", value: "20/30", status: "Mild Impairment", range: "20/20" },
                { name: "Intraocular Pressure", value: "16 mmHg", status: "Normal", range: "10-21 mmHg" },
                { name: "Retinal Exam", value: "No abnormalities", status: "Normal", range: "N/A" },
              ],
              notes: "Updated prescription for reading glasses. No signs of diabetic retinopathy.",
            },
          ].map((exam, index) => (
            <div key={index} className="rounded-md border">
              <div className="border-b bg-muted/40 px-4 py-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{exam.date}</span>
                  </div>
                  <Badge variant="outline">{exam.type}</Badge>
                </div>
              </div>
              <div className="p-4">
                <div className="mb-2">
                  <div className="font-medium">{exam.orderedBy}</div>
                  <div className="text-sm text-muted-foreground">{exam.department}</div>
                </div>
                <div className="space-y-2">
                  <div>
                    <div className="text-sm font-medium">Results</div>
                    <div className="mt-2 space-y-2">
                      {exam.results.map((result, idx) => (
                        <div key={idx} className="grid grid-cols-4 gap-2 text-sm">
                          <div className="font-medium">{result.name}</div>
                          <div>{result.value}</div>
                          <div>
                            <Badge variant={result.status === "Normal" ? "outline" : "destructive"} className="text-xs">
                              {result.status}
                            </Badge>
                          </div>
                          <div className="text-muted-foreground">{result.range}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm font-medium">Notes</div>
                    <div className="text-sm">{exam.notes}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          Download Medical Exam Results
        </Button>
      </CardFooter>
    </Card>
  )
}

