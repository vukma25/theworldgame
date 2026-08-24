import { useState } from "react"
import ImageLayout from "./ImageLayout"
import ImageViewerModal from "./ImageViewModal"

export default function Image({ src, alt, loading = false }) {
    const [open, setOpen] = useState(false)

    function onImageClick() { setOpen(true) }
    function onClose() { setOpen(false) }

    return (
        <>
            <ImageLayout src={src} alt={alt} loading={loading} onImageClick={onImageClick} />
            <ImageViewerModal open={open} onClose={onClose} imageUrl={src} imageAlt={alt} />
        </>
    )
}