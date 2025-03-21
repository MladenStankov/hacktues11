"use client"

import { makeSuggestion } from '@/app/actions/make-suggestion'
import { Button } from '@/components/ui/button'
import { UploadButton } from '@/app/actions/uploadthing'
//import prisma from '@/lib/prisma'
//import { getPatientAppointments } from '@/app/actions/patient-actions'
//import { auth } from '@/lib/auth'
//import { headers } from 'next/headers'

//import { z } from "zod";
//import { DoctorSpecialization } from "@prisma/client";
//import { type ClientUploadedFileData } from "uploadthing/types";


/*export const DoctorSchema = z.object({
    id: z.string().uuid(),
    userId: z.string(),
    licenseNumber: z.string(),
    specialization: z.nativeEnum(DoctorSpecialization),
    hospital: z.string().nullable(),
    createdAt: z.string(),
    updatedAt: z.string(),
});*/



export default function page() {
    const handleClick = async () => {
//        const session = await auth.api.getSession({
//            headers: await headers(),
//          });
//        const patientId = session?.user?.id;
//        const appointments = await getPatientAppointments(patientId)
//        console.log(appointments)
        await makeSuggestion([""])
    }

    // type Doctor = z.infer<typeof DoctorSchema>;

    return (
        <div>
            <Button onClick={handleClick}>Test AI</Button>
            <UploadButton
                className='bg-primary text-white'
                endpoint="xmlUploader"
                onClientUploadComplete={(res) => { // : ClientUploadedFileData<{ uploadedBy: Doctor }>[]
                    console.log("Full response:", res);

                    if (res.length > 0) {
                        const uploadedBy = res[0].serverData.uploadedBy;
                        console.log("Doctor ID:", uploadedBy.id);
                        console.log("Doctor License:", uploadedBy.licenseNumber);

                        alert(`Upload Completed by Doctor: ${uploadedBy.id}`);
                    }
                }}
                onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                }}
            />
        </div>
    )
}
