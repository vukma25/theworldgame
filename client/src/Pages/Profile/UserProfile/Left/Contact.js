import { useSelector } from "react-redux"
import { Box, Typography } from "@mui/material"
import { Mail, Today } from "@mui/icons-material"
import moment from "moment/moment"

export default function Contact() {
    const { user_information: {
        email, createdAt
    } } = useSelector((state) => state.profile)

    return (
        <Box sx={{ textAlign: 'left', mb: 3 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Mail fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">{email}</Typography>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                <Today fontSize="small" sx={{ mr: 1, color: 'text.secondary' }} />
                <Typography variant="body2">
                    Joined in {moment(createdAt).format("DD/MM/YYYY - hh:mm")}
                </Typography>
            </Box>
        </Box>
    )
}