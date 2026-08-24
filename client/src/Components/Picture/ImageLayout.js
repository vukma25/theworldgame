import { useState } from 'react'
import { Box, Typography, CircularProgress } from '@mui/material'
import { ZoomIn } from '@mui/icons-material'

export default function Image({ src, alt, loading = false, onImageClick }) {
    const [isLoading, setIsLoading] = useState(true)

    if (!src) {
        return (
            <Box sx={{
                width: 200,
                height: 150,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'rgba(0,0,0,0.05)',
                borderRadius: '8px',
                color: 'gray'
            }}>
                <Typography>{alt}</Typography>
            </Box>
        )
    }

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                maxWidth: 280,
                cursor: 'pointer',
                borderRadius: '8px',
                overflow: 'hidden',
                backgroundColor: 'rgba(0,0,0,0.03)',
            }}
            onClick={onImageClick}
        >
            {isLoading && (
                <CircularProgress
                    size={40}
                    sx={{ color: "var(--cl-primary-blue)", position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }} />
            )}
            <img
                src={src}
                alt={alt || "Hình ảnh"}
                style={{
                    display: "block",
                    width: '100%',
                    height: 'auto',
                    maxHeight: 300,
                    objectFit: 'cover',
                    display: loading ? 'none' : 'block',
                    transition: 'transform 0.2s ease',
                    borderRadius: '8px',
                }}
                onLoad={() => setIsLoading(false)}
            // }}
            />
            {/* Overlay hiệu ứng khi hover */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    opacity: 0,
                    transition: 'opacity 0.2s ease',
                    borderRadius: '8px',
                    '&:hover': {
                        opacity: 1,
                    },
                }}
            >
                <ZoomIn sx={{ color: 'white', fontSize: 48 }} />
            </Box>
        </Box>
    )
}