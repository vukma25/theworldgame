import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setMyself } from "../../../redux/features/chat"
import { Box, TextField, IconButton } from '@mui/material'
import FileInput from '../../../Components/FileInput/FileInput'
import Picker from '../../../Components/Emoji/Picker'
import { Image, EmojiEmotions, Close } from "@mui/icons-material"
import { Send } from '@mui/icons-material'
import { sendMessage } from '../../../redux/features/user'

function Typing() {
    const { selectedConversation } = useSelector((state) => state.event)
    const { user: { _id } } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const [message, setMessage] = useState('')
    const [error, setError] = useState({ active: false, reason: '' })
    const inputRef = useRef(null)
    const [openPicker, setOpenPicker] = useState(false)

    function handleInput(e) {
        setMessage(e.target.value)
    }

    function handleSend(e = null) {
        e?.preventDefault()
        if (!selectedConversation) {
            console.log("?")
            setError({ active: true, reason: 'You do not choose any chat yet' })
            setMessage('')
            return
        }
        if (message.length === 0 && !e) {
            console.log("??")
            setError({ active: true, reason: 'If you want to chat, please do not leave input empty' })
            setMessage('')
            return
        }

        const form = e?.target
        let formData = null
        if (form) {
            formData = new FormData(form)
        } else {
            formData = new FormData()
        }

        const { conversationId } = selectedConversation
        const sender = _id;
        const sentAt = new Date()
        formData.append("conversationId", conversationId)
        formData.append("content", message)
        formData.append("sentAt", sentAt)
        formData.append("sender", sender)

        dispatch(sendMessage(formData))
        setMessage('')
        dispatch(setMyself(true))

        if (inputRef.current) {
            inputRef.current.focus()
        }
    }

    function handleKeyDown(e) {
        if (e.key === 'Enter') {
            handleSend()
        }
    }

    function handleClickIcons(e) {
        setMessage(prev => prev + e.emoji)
    }

    function handleTogglePicker() {
        setOpenPicker(prev => !prev)
    }

    useEffect(() => {
        if (!error.active) return
        const timer = setTimeout(function () {
            setError({ active: false, reason: '' })
        }, 2500)

        return () => clearTimeout(timer)
    }, [error])

    return (
        <Box sx={{ position: "relative" }}>
            <Picker conf={{ width: 350, height: 400, open: openPicker }} getEmoji={handleClickIcons} />
            <Box sx={{
                p: 2, display: 'flex', alignItems: 'flex-start', borderTop: '1px solid #ddd',
                background: "var(--cl-white-pure)",
            }}>
                <FileInput name={"image"} uploadAction={handleSend}>
                    <Image sx={{ fontSize: "2.5rem", color: "var(--brand-700)" }} />
                </FileInput>
                <IconButton color="primary">
                    {!openPicker ? <EmojiEmotions
                        sx={{ fontSize: "2.5rem", color: "var(--brand-700)" }}
                        onClick={handleTogglePicker} /> :
                        <Close
                            sx={{ fontSize: "2.5rem", color: "var(--brand-700)" }}
                            onClick={handleTogglePicker} />}
                </IconButton>
                <TextField
                    inputRef={inputRef}
                    variant="outlined"
                    placeholder='Nhập tin nhắn...'
                    helperText={error.active ? error.reason : `${message.length}/5000`}
                    value={message}
                    onChange={handleInput}
                    onKeyDown={handleKeyDown}
                    sx={{
                        width: "100%",
                        '& .css-quhxjy-MuiInputBase-root-MuiOutlinedInput-root': {
                            borderRadius: "4.5rem",
                            height: "4rem",
                            outline: "none"
                        },
                        '& input': {
                            fontSize: "1.4rem",
                            height: "3.2rem",
                            padding: "0 1.5rem"
                        }
                    }}
                />
                <IconButton color="primary" onClick={() => handleSend()}>
                    <Send sx={{ fontSize: "2.5rem", color: "var(--brand-700)" }} />
                </IconButton>
            </Box>
        </Box>
    )
}

export default React.memo(Typing)