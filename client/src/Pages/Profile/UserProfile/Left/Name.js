import { useSelector } from "react-redux"
import { Box, Typography, Chip } from "@mui/material"

export default function Name() {
    const { user_information: {
        username, role
    } } = useSelector((state) => state.profile)

    return (
        <Box sx={{
            display: "flex",
            gap: "1rem", alignItems:
                "center",
            justifyContent: "center",
            mb: 2
        }}>
            <Typography variant="h5" fontWeight="bold">
                {username}
            </Typography>

            <Chip
                label={role}
                color="primary"
                variant="outlined"
                size="small"
            />
        </Box>
    )
}