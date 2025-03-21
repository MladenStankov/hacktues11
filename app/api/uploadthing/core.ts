import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import prisma from "@/lib/prisma";

const f = createUploadthing();


export const ourFileRouter = {
    xmlUploader: f({
        text: {
            maxFileSize: "128KB",
            maxFileCount: 10,
        },
    })
        .middleware(async () => {

            const session = await auth.api.getSession({
                headers: await headers(),
            });

            if (!session) throw new UploadThingError("Not logged in");

            const doctor = await prisma.doctor.findUnique({
                where: { userId: session.user.id },
              });
            if(!doctor) throw new UploadThingError("Not a doctor");

            
            return { doctor: doctor };
        })
        .onUploadComplete(async ({ file, metadata }) => {
            console.log("Uploaded by:", metadata.doctor);
            console.log("file url", file.ufsUrl); // shte pazim v bazata 
            return {
                uploadedBy: {
                    ...metadata.doctor,
                    createdAt: metadata.doctor.createdAt.toISOString(), // Date is not a valid JSON type
                    updatedAt: metadata.doctor.updatedAt.toISOString(),
                },
            };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
