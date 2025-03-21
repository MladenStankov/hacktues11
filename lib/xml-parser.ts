"use server"

import { parseStringPromise } from "xml2js"
import { getXMLFiles } from "./xml-loader"

export interface MedicalExamResult {
  id: string
  name: string
  value: string
  status: string
  range: string
}

export interface MedicalExam {
  id: string
  date: string
  type: string
  orderedBy: {
    name: string
    department: string
  }
  results: MedicalExamResult[]
  notes: string
  patientId?: string
  appointmentId?: string
}


export async function parseXmlString(xmlContent: string): Promise<MedicalExam | null> {
  try {
    
    const result = await parseStringPromise(xmlContent, {
      explicitArray: false,
      mergeAttrs: true,
    })

    
    const exam = result.medicalExam

    if (!exam) {
      console.error("Invalid XML format: missing medicalExam root element")
      return null
    }

    
    let results: MedicalExamResult[] = []

    if (exam.results && exam.results.result) {
      
      const resultItems = Array.isArray(exam.results.result) ? exam.results.result : [exam.results.result]

      results = resultItems.map((item: any, index: number) => ({
        id: item.id || `result-${index}`,
        name: item.name || "Unknown Test",
        value: item.value || "N/A",
        status: item.status || "Unknown",
        range: item.range || "N/A",
      }))
    }

    return {
      id: exam.id || `exam-${Date.now()}`,
      date: exam.date || new Date().toISOString(),
      type: exam.type || "General Examination",
      orderedBy: {
        name: exam.orderedBy?.name || "Unknown Doctor",
        department: exam.orderedBy?.department || "Unknown Department",
      },
      results,
      notes: exam.notes || "",
      patientId: exam.patientId || undefined,
      appointmentId: exam.appointmentId || undefined,
    }
  } catch (error) {
    console.error("Error parsing XML string:", error)
    return null
  }
}


export async function parseXmlFile(xmlFilePath: string): Promise<MedicalExam | null> {
  try {
    const fs = require("fs")
    const path = require("path")

    
    const xmlContent = fs.readFileSync(path.resolve(process.cwd(), xmlFilePath), "utf-8")

    return parseXmlString(xmlContent)
  } catch (error) {
    console.error(`Error parsing XML file ${xmlFilePath}:`, error)
    return null
  }
}


export async function loadAllMedicalExams(): Promise<MedicalExam[]> {
  try {
    
    const xmlFiles = await getXMLFiles()

    
    const examPromises = xmlFiles.map((xmlContent) => parseXmlString(xmlContent))

    
    const exams = (await Promise.all(examPromises)).filter(Boolean) as MedicalExam[]

    return exams
  } catch (error) {
    console.error("Error loading medical exams:", error)
    return []
  }
}


export async function loadPatientMedicalExams(patientId: string): Promise<MedicalExam[]> {
  try {
    
    const allExams = await loadAllMedicalExams()

    
    return allExams.filter((exam) => {
      
      if (exam.patientId) {
        return exam.patientId === patientId
      }

      
      return false
    })
  } catch (error) {
    console.error(`Error loading medical exams for patient ${patientId}:`, error)
    return []
  }
}

