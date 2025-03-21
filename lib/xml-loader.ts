import fs from "fs"
import path from "path"


export async function getXMLFiles(): Promise<string[]> {
  const medicalRecordsDir = path.resolve(process.cwd(), "medical_records")

  try {
    const files = await fs.promises.readdir(medicalRecordsDir)
    const xmlFiles = files.filter((file) => path.extname(file).toLowerCase() === ".xml")

    const xmlContents = await Promise.all(
      xmlFiles.map(async (file) => {
        const filePath = path.join(medicalRecordsDir, file)
        return fs.promises.readFile(filePath, "utf-8")
      }),
    )

    return xmlContents
  } catch (error) {
    console.error("Error reading XML files:", error)
    return []
  }
}

