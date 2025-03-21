"use client"

import { makeSuggestion } from '@/app/actions/make-suggestion'
import { Button } from '@/components/ui/button'
import { UploadButton } from '@/app/actions/uploadthing'



export default function page() {
    const handleClick = async () => {
        await makeSuggestion()
    }

    return (
        <div>
            <Button onClick={handleClick}>Test AI</Button>
            <UploadButton
            className='bg-primary text-white'
                endpoint="xmlUploader"
                onClientUploadComplete={(res: any) => {
                    console.log("Files: ", res);
                    alert("Upload Completed");
                }}
                onUploadError={(error: Error) => {
                    alert(`ERROR! ${error.message}`);
                }}
            />
        </div>
    )
}
