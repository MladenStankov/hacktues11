"use server"

import { fetchAllDiseasesAndAllergies } from "@/lib/medical-summary"


export async function makeSummary() {
    const notes = await fetchAllDiseasesAndAllergies()
    
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
                            
                            I have nodes made by doctors over a period of time, showing how a patient's health has changed over 
                            the time. The nodes will most definitely have some diseases and allergies that the patient has now
                            or has been cured from. Here are the nodes that you will have to use:
                            ${notes}
                            
                            Make a summary of the patient's previous and current diseases and allergies making it look as a plan
                            that is easy to follow. By using everything you can find on the internet and the past nodes from oldest
                            to newest try to see if and when the patient have gotten and/or cured every disease and allergy that
                            you can find.
                            
                            Try using the nodes from oldest to newest and just list them in the following format:
                            - If the patient has a disease or allergy that he hasn't cured from write something like:
                                "Cancer (2020-12-08 - )"
                            - And if the disease or allergy has been cured from just add the end date:
                                "Cancer (2020-12-08 - 2024-03-26)"
                            
                            The idea is to make it as a list or count them with comas. Just make it easy to traverse in and to read.`
                }
            ]
        })
    })

    const data = await response.json()
    console.log(data.choices?.[0]?.message?.content || 'No response received.')
}