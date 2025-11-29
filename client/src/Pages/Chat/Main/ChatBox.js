import { useEffect, useRef, useCallback } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Box, Typography, CircularProgress } from "@mui/material"
import BadgeAvatar from "../../../Components/BadgeAvatar/BadgeAvatar"
import { DoneAll, Done } from '@mui/icons-material'
import { readMessage } from "../../../redux/features/user"
import moment from "moment/moment"

const classes = { display: "flex", gap: ".5rem", background: "var(--ink-300)", padding: ".2rem .5rem", borderRadius: "1rem" }

export default function ChatBox() {
    const { listMessages } = useSelector((state) => state.chat)
    const { user: { _id } } = useSelector((state) => state.auth)
    const { selectedConversation, unreadMessagePosition, usersOnline } = useSelector((state) => state.event)
    const { isLoading } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const chatBoxRef = useRef(null)

    const isOnline = useCallback((id) => {
        return !!usersOnline.find(([userId, _]) => userId.toString() === id.toString())
    }, [usersOnline])
    
    useEffect(() => {
        if (selectedConversation && listMessages.length !== 0) {
            const { conversationId } = selectedConversation
            const userId = _id
            const id = listMessages[0].conversationId
            const match = id.toString() === conversationId.toString()

            if (match && unreadMessagePosition === 1) {
                dispatch(readMessage({ conversationId, userId }))
            }
        }


        if (chatBoxRef.current) {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [listMessages, unreadMessagePosition])

    return (
        <Box
            sx={{
                display:"flex",
                flexDirection:"column",
                flexGrow: 1,
                p: 2,
                overflowY: 'auto',
                gap:".5rem"
            }}
            ref={chatBoxRef}
        >
            {listMessages.map(({ content, sender, sentAt, readBy }, index) => {
                const isMe = sender._id.toString() === _id.toString()

                return (<Box
                    key={index}
                    sx={{
                        width: "100%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: isMe ? 'flex-end' : 'flex-start',
                        mb: 1,
                    }}
                >
                    <Box sx={{display:"flex",flexDirection:"column",gap:".5rem"}}>
                        <Typography sx={{textAlign:`${isMe?"end":"start"}`,fontSize:".8rem"}}>{moment(sentAt).format('DD/MM/YYYY - hh:mm')}</Typography>
                        <Box sx={{
                            display:"flex",gap:".5rem",alignItems:"center",
                            flexDirection:`${isMe?"row-reverse":"row"}`
                        }}>
                            <BadgeAvatar username={sender.username} src={sender.avatar} sx={{width: 24,height: 24}} online={isOnline(sender._id)}/>
                        <Typography
                            variant="h6"
                            sx={{
                                display: 'inline-block',
                                p: 1,
                                borderRadius: 5,
                                backgroundColor: isMe ? 'var(--brand-500)' : 'var(--ink-300)',
                                color: isMe ? 'white' : 'black',
                                maxWidth: 300,
                                wordBreak: "break-all",
                                //overflowWrap: "break-word",
                                height: "auto",
                                padding: "1rem 1.5rem",
                            }}
                        >
                            {content}
                        </Typography>
                        </Box>
                        <Box sx={{
                            display:"flex", alignItems:"center",justifyContent:"flex-end"}}>
                            {(readBy.length >= 2 && isMe) && 
                            (<Box sx={classes}><DoneAll sx={{ color: "var(--brand-700)" }}/><Typography>read</Typography></Box>)}
                            {(readBy.length === 1 && isMe) &&
                            (<Box sx={classes}><Done sx={{ color: "var(--brand-700)" }}/><Typography>sent</Typography></Box>)}
                            {(isLoading && index === listMessages.length) &&
                            (<Box sx={classes}><CircularProgress size={10}/><Typography>sending</Typography></Box>)}
                        </Box>
                    </Box>
                </Box>)
            })}
        </Box>
    )
}