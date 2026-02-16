
import { Box, CircularProgress, Typography, Chip } from '@mui/material'
import { Done, DoneAll } from '@mui/icons-material'


const classes = { display: "flex", gap: ".5rem", background: "var(--ink-300)", padding: ".2rem .5rem", borderRadius: "1rem" }
export default function MessageStatus({ readBy, listMessages, isMe, isLoading, index, edited }) {
    return (
        <Box sx={{
            display: "flex", alignItems: "center", justifyContent: !isMe ? "flex-start" : "flex-end", gap: 1
        }}>
            {edited && <Chip label="edited" size='small' />}
            {(readBy.length >= 2 && isMe) &&
                (<Box sx={classes}><DoneAll sx={{ color: "var(--brand-700)" }} /></Box>)}
            {(readBy.length === 1 && isMe) &&
                (<Box sx={classes}><Done sx={{ color: "var(--brand-700)" }} /></Box>)}
            {(isLoading && index === listMessages.length) &&
                (<Box sx={classes}><CircularProgress size={10} /><Typography>sending</Typography></Box>)}
        </Box>
    )
}