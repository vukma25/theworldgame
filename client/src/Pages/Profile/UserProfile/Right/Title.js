import { useSelector, useDispatch } from "react-redux"
import { Box, Typography, IconButton } from "@mui/material"
import { Edit } from "@mui/icons-material"
import { setMode } from "../../../../redux/features/profile"

export default function Title() {
    const { mode } = useSelector((state) => state.profile)
    const dispatch = useDispatch()

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Typography variant="h6">Personal information</Typography>
            {mode === "view" && (
                <IconButton onClick={() => { dispatch(setMode("edit")) }}>
                    <Edit />
                </IconButton>
            )}
        </Box>
    )
}