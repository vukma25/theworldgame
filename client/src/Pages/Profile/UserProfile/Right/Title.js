import { useContext } from "react"
import { Box, Typography, IconButton } from "@mui/material"
import { Edit } from "@mui/icons-material"
import { ProfileContext } from "./index"

export default function Title() {
    const { mode, setMode } = useContext(ProfileContext)

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Personal information</Typography>
            {mode === "view" && (
                <IconButton onClick={() => setMode("edit")}>
                    <Edit />
                </IconButton>
            )}
        </Box>
    )
}