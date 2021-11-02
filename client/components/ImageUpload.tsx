import { useState, useEffect } from "react"
import { useImagePreview } from '../hooks/ui'

export default function ImageUpload() {
    const [file, imageUpload] = useImagePreview(handleImageUpload)

    function handleImageUpload(e) {
        e.preventDefault();
        console.log('handle uploading-', file);
    }

    return (
        <div>
            {
                imageUpload
            }
        </div>
    )
}