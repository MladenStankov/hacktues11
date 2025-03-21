"use server"

import { fetchMultipleAppointmentsNotes } from "@/lib/note-loader"
import { fetchMultipleAppointmentsXMLs } from "@/lib/xml-loader"


export async function makeSuggestion(appointmentIds: string[]) {
    const xmlFiles = await fetchMultipleAppointmentsXMLs(appointmentIds)
    const notes = await fetchMultipleAppointmentsNotes(appointmentIds)
    
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
        method: "POST",
        headers: {
            "Authorization": "Bearer " + process.env.DEEP_SEEK_API_KEY,
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            "model": "deepseek/deepseek-r1-zero:free",
            "messages": [
                {
                "role": "user",
                "content": `I am developing a medical application that allows users to input their health parameters over time. 
                            I need a system that can analyze trends and predict potential health risks based on historical data.
                            
                            I have patient data that includes many health parameters stored as xml. Each record contains a result, 
                            reading and reference range that the result should be in. The xml files are listed below:
                            ${xmlFiles.join('\n\nNext one: \n')}
                            
                            Make a one to two sentence summary of the patient's medical report with the following prompt.
                            By using everything you can find on the internet and the past medical reports from oldest to newest
                            try to determine if some of the parameters are going up or down and if they are going to get outside
                            of the normal range (if they are outside of the normal range of course suggest immediate consultation
                            with a doctor). Try to suggest a kind of doctor that could be best for the patient or a non medical 
                            treatment that could be applied to the patient. Of course if you can't determine anything wrong or
                            suggest any treatment, just say that the patient is healthy and the parameters are normal.
                            
                            If you can somehow use both machine learning and human knowledge (from internet) to determine if the 
                            patient is healthy or not, please do so. If not use only human knowledge (from internet).
                            You can use the following notes given by the doctor as well:
                            ${notes.join('\n\nNext one: \n')}
                            
                            Additionally try to explain yourself in a way that is easy to understand for the patient.
                            And try not to stress them at all. Be clear that everything is an approximation and that the truth can
                            be determined only by further tests and consultation with a doctor.`
                }
            ]
        })
    })

    const data = await response.json()
    console.log(data.choices?.[0]?.message?.content || 'No response received.')
    return data.choices?.[0]?.message?.content || 'No response received.'
}
