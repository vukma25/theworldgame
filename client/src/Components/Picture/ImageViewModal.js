import { Box, IconButton, Fade } from '@mui/material'
import { Download, Close } from '@mui/icons-material'

const modalStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    zIndex: 9999,
    padding: '20px',
}

const imageContainerStyle = {
    position: 'relative',
    maxWidth: '90vw',
    maxHeight: '90vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}

const imageStyle = {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
    borderRadius: '8px',
    boxShadow: '0 4px 30px rgba(0,0,0,0.5)',
}

const buttonGroupStyle = {
    position: 'absolute',
    top: '20px',
    right: '20px',
    display: 'flex',
    gap: '10px',
    zIndex: 10000,
}

const buttonStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    color: 'white',
    cursor: "pointer",
    width: '48px',
    height: '48px',
    borderRadius: '50%',
}

export default function ImageViewerModal({ open, onClose, imageUrl, imageAlt }) {
    const handleDownload = async () => {
        try {
            const response = await fetch(imageUrl)
            const blob = await response.blob()
            const url = window.URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url
            link.download = imageAlt || 'image.jpg'
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            window.URL.revokeObjectURL(url)
        } catch (error) {
            console.error('Lỗi tải ảnh:', error)
            // Fallback: mở ảnh trong tab mới
            window.open(imageUrl, '_blank')
        }
    }

    const handleDownloadViaLink = () => {
        // Cách 2: Dùng thẻ a đơn giản hơn (có thể không hoạt động với ảnh cross-origin)
        const link = document.createElement('a')
        link.href = imageUrl
        link.target = '_blank'
        link.download = imageAlt || 'image.jpg'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    if (!open) return null

    return (
        <Box sx={modalStyle} onClick={onClose}>
            <Fade in={open}>
                <Box sx={imageContainerStyle} onClick={(e) => e.stopPropagation()}>
                    <img
                        src={imageUrl}
                        alt={imageAlt || 'Hình ảnh'}
                        style={imageStyle}
                    />
                    <Box sx={buttonGroupStyle}>
                        <IconButton
                            sx={buttonStyle}
                            onClick={handleDownload}
                            title="Tải ảnh về máy"
                        >
                            <Download />
                        </IconButton>
                        <IconButton
                            sx={buttonStyle}
                            onClick={onClose}
                            title="Đóng"
                        >
                            <Close />
                        </IconButton>
                    </Box>
                </Box>
            </Fade>
        </Box>
    )
}