import React, { useState, useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setMyself } from "../../../redux/features/chat"
import { Box, TextField, IconButton } from '@mui/material'
import { AttachFile, Image, EmojiEmotions } from "@mui/icons-material"
import { Send } from '@mui/icons-material'
import { sendMessage } from '../../../redux/features/user'

function Typing() {
    const { selectedConversation } = useSelector((state) => state.event)
    const { user: { _id } } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const [message, setMessage] = useState('')
    const [error, setError] = useState({ active: false, reason: '' })
    const inputRef = useRef(null)

    function handleInput(e) {
        setMessage(e.target.value)
    }

    function handleSend() {
        if (!selectedConversation) {
            setError({ active: true, reason: 'You do not choose any chat yet' })
            setMessage('')
            return
        }
        if (message.length === 0) {
            setError({ active: true, reason: 'If you want to chat, please do not leave input empty' })
            setMessage('')
            return
        }
        const { conversationId } = selectedConversation
        const sender = _id;
        const sentAt = new Date()

        dispatch(sendMessage({ conversationId, content: message, sender, sentAt }))
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

    useEffect(() => {
        if (!error.active) return
        const timer = setTimeout(function () {
            setError({ active: false, reason: '' })
        }, 2500)

        return () => clearTimeout(timer)
    }, [error])

    return (
        <Box sx={{
            p: 2, display: 'flex', alignItems: 'flex-start', borderTop: '1px solid #ddd',
            background: "var(--cl-white-pure)",
        }}>
            <IconButton color="primary">
                <AttachFile sx={{ fontSize: "2.5rem", color: "var(--brand-700)" }} />
            </IconButton>
            <IconButton color="primary">
                <Image sx={{ fontSize: "2.5rem", color: "var(--brand-700)" }} />
            </IconButton>
            <IconButton color="primary">
                <EmojiEmotions sx={{ fontSize: "2.5rem", color: "var(--brand-700)" }} />
            </IconButton>
            <TextField
                inputRef={inputRef}
                variant="outlined"
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
            <IconButton color="primary" onClick={handleSend}>
                <Send sx={{ fontSize: "2.5rem", color: "var(--brand-700)" }} />
            </IconButton>
        </Box>
    )
}

export default React.memo(Typing)