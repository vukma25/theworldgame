import { Typography } from '@mui/material'

export default function Message({ refer, isMe, content, animate }) {
    return (
        <Typography
            variant="h6"
            sx={{
                display: 'inline-block',
                p: 1,
                borderRadius: 5,
                backgroundColor: isMe ? 'var(--brand-500)' : 'var(--ink-300)',
                color: isMe ? 'white' : 'black',
                maxWidth: 300,
                wordBreak: "break-all",
                //overflowWrap: "break-word",
                height: "auto",
                padding: "1rem 1.5rem",
                animation: animate ? "bounce 1s ease" : "none"
            }}
            ref={refer}
        >
            {content}
        </Typography>
    )
}