import { useRef, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setContent, updateListMessage, raiseError } from "../../../redux/features/chat"
import { Box, TextField, IconButton } from '@mui/material'
import { Send } from '@mui/icons-material'
import { sendMessage } from '../../../redux/features/user'

export default function Typing() {
    const { content, error: {isError, reason} } = useSelector((state) => state.chat)
    const { selectedConversation } = useSelector((state) => state.event)
    const { user: {_id} } = useSelector((state) => state.auth)
    const dispatch = useDispatch()

    const inputRef = useRef(null)

    function handleInput(e) {
        dispatch(setContent(e.target.value))
    }

    function handleSend() {
        if (!selectedConversation) {
            dispatch(raiseError({isError:true, reason:'You do not choose any chat yet'}))
            dispatch(setContent(''))
            return
        }
        if (content.length === 0) {
            dispatch(raiseError({isError:true, reason:'If you want to chat, please do not leave input empty'}))
            dispatch(setContent(''))
            return
        }
        const { conversationId } = selectedConversation
        const sender = _id;
        const sentAt = new Date()

        dispatch(sendMessage({conversationId, content, sender, sentAt}))
        dispatch(setContent(''))

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
        if (reason.length === 0) return
        const timer = setTimeout(function() {
            dispatch(raiseError({isError:false, reason: ''}))
        }, 2500)

        return () => clearTimeout(timer)
    }, [reason])

    return (
        <Box sx={{p:2,display:'flex',alignItems:'center',borderTop:'1px solid #ddd',
            background:"var(--cl-white-pure)",
        }}>
            <TextField
                inputRef={inputRef}
                variant="standard"
                label="Enter message"
                error={isError}
                helperText={reason}
                value={content}
                onChange={handleInput}
                onKeyDown={handleKeyDown}
                sx={{ mr: 1,width: "calc(100% - 110px)",
                    '& input': {
                        fontSize: "1.4rem",
                    },
                    '& label': {
                        fontSize: "1.4rem",
                    }
                }}
            />
            <IconButton color="primary" onClick={handleSend}>
                <Send sx={{ fontSize: "2.5rem", color:"var(--brand-700)"}}/>
            </IconButton>
        </Box>
    )
}