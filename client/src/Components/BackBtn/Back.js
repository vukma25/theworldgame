import { useNavigate } from 'react-router-dom'
import { IconButton } from '@mui/material'
import { ArrowBack } from '@mui/icons-material'

export default function BackBtn(sx = {}) {
    const navigate = useNavigate()

    function prev() {
        navigate(-1)
    }

    return (
        <IconButton
            onClick={prev}
            sx={{ width: "3.5rem" }}
        >
            <ArrowBack sx={{ fontSize: "2rem", ...sx }} />
        </IconButton>
    )
}