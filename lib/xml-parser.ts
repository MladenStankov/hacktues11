import { parseStringPromise } from "xml2js"

export interface MedicalResult {
  id?: string
  name: string
  value: string
  unit: string
  status: string
  range: string
  isAbnormal: boolean
}

export interface MedicalExam {
  id: string
  date: Date
  type: string
  orderedBy: {
    name: string
    department: string
  }
  results: MedicalResult[]
  notes: string
  patientName?: string
  patientId?: string
}

// Helper function to determine if a result is abnormal based on reference range
function checkIfAbnormal(result: string, referenceRange: string): { isAbnormal: boolean; status: string } {
  if (!referenceRange || referenceRange.trim() === "") {
    return { isAbnormal: false, status: "No Range" }
  }

  const numericResult = Number.parseFloat(result)
  if (isNaN(numericResult)) {
    return { isAbnormal: false, status: "Normal" }
  }

  // Handle different reference range formats
  if (referenceRange.includes("-")) {
    // Format: "min - max"
    const [minStr, maxStr] = referenceRange.split("-").map((s) => s.trim())
    const min = Number.parseFloat(minStr)
    const max = Number.parseFloat(maxStr)

    if (!isNaN(min) && !isNaN(max)) {
      if (numericResult < min) {
        return { isAbnormal: true, status: "Low" }
      } else if (numericResult > max) {
        return { isAbnormal: true, status: "High" }
      }
    }
  } else if (referenceRange.toLowerCase().includes("up to")) {
    // Format: "Up to X"
    const maxStr = referenceRange.toLowerCase().replace("up to", "").trim()
    const max = Number.parseFloat(maxStr)

    if (!isNaN(max) && numericResult > max) {
      return { isAbnormal: true, status: "High" }
    }
  }

  return { isAbnormal: false, status: "Normal" }
}

// Parse a single XML string into a MedicalExam object
export async function parseXML(xmlString: string): Promise<MedicalExam | null> {
  try {
    if (!xmlString || xmlString.trim() === "") {
      return null
    }

    const result = await parseStringPromise(xmlString, {
      explicitArray: false,
      mergeAttrs: true,
    })

    if (!result.medical_report) {
      console.warn("Invalid XML format: missing medical_report root element")
      return null
    }

    const medicalReport = result.medical_report
    const patient = medicalReport.patient || {}
    const hematology = medicalReport.hematology?.test || []
    const biochemistry = medicalReport.biochemistry?.test || []

    // Convert to arrays if they're single objects
    const hematologyTests = Array.isArray(hematology) ? hematology : [hematology]
    const biochemistryTests = Array.isArray(biochemistry) ? biochemistry : [biochemistry]

    // Combine all tests
    const allTests = [...hematologyTests, ...biochemistryTests]

    // Extract results and convert to our format
    const results: MedicalResult[] = []

    allTests.forEach((test: any) => {
      if (test && test.name) {
        const { isAbnormal, status } = checkIfAbnormal(test.result || "0", test.reference_range || "")

        results.push({
          name: test.name,
          value: test.result || "N/A",
          unit: test.unit || "",
          status: status,
          range: test.reference_range || "N/A",
          isAbnormal: isAbnormal,
        })
      }
    })

    // Create a unique ID based on patient info and date
    const examId = `exam-${patient.egn || ""}-${patient.date_of_measurement || Date.now()}`
    const examDate = patient.date_of_measurement ? new Date(patient.date_of_measurement) : new Date()

    // Determine exam type based on sections present
    let examType = "General Examination"
    if (hematologyTests.length > 0 && biochemistryTests.length > 0) {
      examType = "Hematology & Biochemistry"
    } else if (hematologyTests.length > 0) {
      examType = "Hematology"
    } else if (biochemistryTests.length > 0) {
      examType = "Biochemistry"
    }

    // Extract doctor info
    const doctorInfo = patient.treating_doctor || ""
    let doctorName = doctorInfo
    let department = ""

    // Try to parse department if format is "Dr. Name - Department"
    if (doctorInfo.includes("-")) {
      const parts = doctorInfo.split("-").map((p: string) => p.trim())
      doctorName = parts[0]
      department = parts[1] || ""
    }

    return {
      id: examId,
      date: examDate,
      type: examType,
      orderedBy: {
        name: doctorName,
        department: department,
      },
      results: results,
      notes: "Medical report generated from laboratory tests.",
      patientName: patient.name,
      patientId: patient.egn,
    }
  } catch (error) {
    console.error("Error parsing XML:", error)
    return null
  }
}

// Parse multiple XML strings into MedicalExam objects
export async function parseMultipleXML(xmlStrings: string[]): Promise<MedicalExam[]> {
  const exams: MedicalExam[] = []

  for (const xml of xmlStrings) {
    const exam = await parseXML(xml)
    if (exam) {
      exams.push(exam)
    }
  }

  return exams
}

