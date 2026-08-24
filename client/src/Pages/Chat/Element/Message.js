import { useState } from 'react'
import { Typography, Box, Modal, IconButton, Fade, Backdrop } from '@mui/material'
import { Download, Close, ZoomIn } from '@mui/icons-material'
import Image from '../../../Components/Picture'
import moment from 'moment/moment'

const rl = [15, 5, 15, 15]
const rr = [5, 15, 15, 15]
const radiusLeft = rl.map((cor) => `${cor}px`).join(" ")
const radiusRight = rr.map((cor) => `${cor}px`).join(" ")

export default function Message({ refer, isMe, content, animate, sentAt, username, contentType }) {
    const textAlign = isMe ? "right" : "left"
    const color = isMe ? 'var(--cl-white)' : 'var(--cl-black-lighter)'
    const [open, setOpen] = useState(false)

    function onClickImage() { setOpen(true) }
    function onClose() { setOpen(false) }

    return (
        <>
            <Box
                ref={refer}
                sx={{
                    padding: ".5rem 1.5rem",
                    maxWidth: 300,
                    borderRadius: isMe ? radiusLeft : radiusRight,
                    backgroundColor: isMe ? 'var(--cl-primary-blue)' : 'var(--white)',
                    display: "flex",
                    flexDirection: "column",
                    gap: ".2rem",
                    animation: animate ? "bounce 1s ease" : "none",
                    // Đảm bảo ảnh không bị tràn
                    overflow: 'hidden',
                }}
            >
                <Typography variant="h6" sx={{ textAlign, color, fontSize: "1rem" }}>
                    {username}
                </Typography>

                {contentType === "text" ? (
                    <Typography
                        sx={{
                            width: "100%",
                            fontSize: "1.25rem",
                            textAlign,
                            color: isMe ? "var(--cl-white-pure)" : "var(--cl-black)",
                            wordBreak: "break-all",
                            height: "auto",
                        }}
                    >
                        {content}
                    </Typography>
                ) : (<Image src={content} src={content} />)}

                <Typography sx={{ textAlign, color, fontSize: '0.75rem' }}>
                    {moment(sentAt).format('hh:mm')}
                </Typography>
            </Box>
        </>
    )
}