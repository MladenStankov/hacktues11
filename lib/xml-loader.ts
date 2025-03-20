"use server";
import fs from "fs";
import path from "path";


export async function getXMLFiles(): Promise<string[]> {
    const dirPath = path.join(process.cwd(), "medical_records")
    const files = fs.readdirSync(dirPath).filter(file => file.endsWith(".xml"))

    return files.map(file => fs.readFileSync(path.join(dirPath, file), "utf-8"))
}