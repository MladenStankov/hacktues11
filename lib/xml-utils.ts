// import type { Appointment, Doctor, DoctorSpecialization } from "@prisma/client"
// import type { MedicalExam } from "./xml-parser"

// export function createExamFromAppointment(
//   appointment: Appointment & {
//     doctor: Doctor & {
//       user: { name: string }
//     }
//   },
// ): MedicalExam {
//   return {
//     id: `exam-from-appointment-${appointment.id}`,
//     date: appointment.date.toISOString(),
//     type: "Medical Examination",
//     orderedBy: {
//       name: appointment.doctor.user.name,
//       department: getDepartmentFromSpecialization(appointment.doctor.specialization),
//     },
//     results: [],
//     notes: appointment.notes || "No detailed results available",
//     patientId: appointment.patientId,
//     appointmentId: appointment.id,
//   }
// }

// export function getDepartmentFromSpecialization(specialization: DoctorSpecialization): string {
//   const mapping: Record<DoctorSpecialization, string> = {
//     GENERAL_PRACTITIONER: "General Practice",
//     ALLERGIST: "Allergy & Immunology",
//     ANESTHESIOLOGIST: "Anesthesiology",
//     CARDIOLOGIST: "Cardiology",
//     DERMATOLOGIST: "Dermatology",
//     ENDOCRINOLOGIST: "Endocrinology",
//     GASTROENTEROLOGIST: "Gastroenterology",
//     HEMATOLOGIST: "Hematology",
//     INFECTIOUS_DISEASE: "Infectious Disease",
//     NEUROLOGIST: "Neurology",
//     NEPHROLOGIST: "Nephrology",
//     OBSTETRICIAN: "Obstetrics",
//     GYNECOLOGIST: "Gynecology",
//     ONCOLOGIST: "Oncology",
//     OPHTHALMOLOGIST: "Ophthalmology",
//     ORTHOPEDIC_SURGEON: "Orthopedic Surgery",
//     OTOLARYNGOLOGIST: "Otolaryngology",
//     PEDIATRICIAN: "Pediatrics",
//     PSYCHIATRIST: "Psychiatry",
//     PULMONOLOGIST: "Pulmonology",
//     RADIOLOGIST: "Radiology",
//     RHEUMATOLOGIST: "Rheumatology",
//     UROLOGIST: "Urology",
//     PATHOLOGIST: "Pathology",
//     PLASTIC_SURGEON: "Plastic Surgery",
//     GENERAL_SURGEON: "General Surgery",
//     VASCULAR_SURGEON: "Vascular Surgery",
//     NEUROSURGEON: "Neurosurgery",
//     DENTIST: "Dentistry",
//   }

//   return mapping[specialization] || "Medical Department"
// }
