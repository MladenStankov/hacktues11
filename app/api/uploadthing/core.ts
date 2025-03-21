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
            return {}; // temp za test

            const session = await auth.api.getSession({
                headers: await headers(),
            });

            if (!session) throw new UploadThingError("Not logged in");

            const doctor = await prisma.doctor.findUnique({
                where: { userId: "user-id-here" },
              });
            if(!doctor) throw new UploadThingError("Not a doctor");
            
            return { doctor: doctor };
        })
        .onUploadComplete(async ({ file }) => {
            // console.log("Uploaded by:", metadata.userId);
            console.log("file url", file.ufsUrl);
            return {}
            //return { uploadedBy: metadata.userId };
        }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
