import { useRef, useState, useContext } from 'react'
import { useSelector } from "react-redux";
import { Box, IconButton, Modal } from "@mui/material"
import { CameraAlt } from "@mui/icons-material"
import BadgeAvatar from "../../../../Components/BadgeAvatar/BadgeAvatar";
import { LogContext } from '../../Profile';
import api from '../../../../lib/api';

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    boxShadow: 24,
};

export default function UserAvatar() {
    const { user_information: { username, avatar }, isLoading } = useSelector((state) => state.profile)
    const { user } = useSelector((state) => state.auth)
    const fileRef = useRef(null)
    const btnRef = useRef(null)
    const { setLog } = useContext(LogContext)
    const [open, setOpen] = useState(false)

    function handleClose() {
        setOpen(false)
    }

    function handleOpen() {
        setOpen(true)
    }

    function fakeFileInput() {
        if (!fileRef.current) return
        fileRef.current.click()
    }

    function chooseImage(e) {
        const file = e.target.files[0]
        if (file && btnRef.current) {
            btnRef.current.click()
        }
    }

    async function uploadImage(e) {
        try {
            e.preventDefault()
            const form = e.target
            const formData = new FormData(form)
            formData.append("userId", user._id)
            setLog({ type: "info", message: "Updating" })
            const res = await api.post('user/upload/avatar', formData, { withCredentials: true })
            setLog({ type: "success", message: res.data.message })
        } catch (e) {
            setLog({ type: "error", message: "Update failed" })
        }

    }

    return (
        <Box sx={{ position: 'relative', display: 'inline-block' }}>
            <Box sx={{ cursor: "pointer" }} onClick={handleOpen}>
                <BadgeAvatar username={username} src={avatar} online={false} sx={{ width: "15rem", height: "15rem", fontSize: "3rem" }} />
            </Box>
            <IconButton
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 10,
                    bgcolor: 'primary.main',
                    color: 'white',
                    '&:hover': { bgcolor: 'primary.dark' }
                }}
                onClick={fakeFileInput}
                disabled={isLoading}
            >
                <CameraAlt />
            </IconButton>
            <form
                style={{
                    position: "absolute",
                    visibility: "hidden",
                    overflow: "hidden",

                }}
                encType="multipart/form-data"
                onSubmit={uploadImage}
            >
                <input
                    type="file"
                    name="avatar"
                    ref={fileRef}
                    accept="image/png"
                    onChange={chooseImage}
                />
                <button type='submit' ref={btnRef}></button>
            </form>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="image"
                aria-describedby="image-avatar-user"
            >
                <Box sx={style}>
                    <img src={avatar} alt='user-avatar' style={{
                        display: "block", width: "100%", height: "auto"
                    }} />
                </Box>
            </Modal>
        </Box>
    )
}