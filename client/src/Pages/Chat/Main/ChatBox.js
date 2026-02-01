import { useEffect, useRef } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Box, Typography } from "@mui/material"
import moment from "moment/moment"
import BadgeAvatar from "../../../Components/BadgeAvatar/BadgeAvatar"
import Message from "../Element/Message"
import MessageStatus from "../Element/MessageStatus"
import MessageOptions from "../Element/MessageOptions"
import PinnedMessages from "./PinnedMessages"
import Delete from "../Dialog/Delete"
import Edit from "../Dialog/Edit"
import { readMessage } from "../../../redux/features/user"
import { useOnline } from "../../../hook/useOnline"

export default function ChatBox() {
    const { listMessages, listPinnedMessages, action } = useSelector((state) => state.chat)
    const { user: { _id } } = useSelector((state) => state.auth)
    const { selectedConversation } = useSelector((state) => state.event)
    const { isLoading } = useSelector((state) => state.user)
    const dispatch = useDispatch()

    const chatBoxRef = useRef(null)
    const isOnline = useOnline()

    useEffect(() => {
        if (selectedConversation && listMessages.length !== 0) {
            const { conversationId } = selectedConversation
            const userId = _id
            const id = listMessages[0].conversationId
            const match = id.toString() === conversationId.toString()

            if (match && !selectedConversation.read) {
                dispatch(readMessage({ conversationId, userId }))
            }
        }


        if (chatBoxRef.current && action === 'new') {
            chatBoxRef.current.scrollTop = chatBoxRef.current.scrollHeight;
        }
    }, [listMessages, selectedConversation, action])


    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: 1,
                p: listPinnedMessages.length === 0
                    ? 2 : "8rem 2rem 2rem 2rem",
                overflowY: 'auto',
                gap: ".5rem",
                '&::-webkit-scrollbar': {
                    width: '.8rem'
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'var(--brand-400)',
                    borderRadius: ".4rem"
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent'
                }
            }}
            ref={chatBoxRef}
        >
            {listPinnedMessages.length !== 0 && <PinnedMessages messages={listPinnedMessages} />}
            {listMessages.map(({ _id: mess_id, content, sender, sentAt, readBy, pinned }, index) => {
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
                    <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                        <Typography sx={{ textAlign: `${isMe ? "end" : "start"}`, fontSize: ".8rem" }}>{moment(sentAt).format('DD/MM/YYYY - hh:mm')}</Typography>
                        <Box sx={{
                            display: "flex", gap: ".5rem", alignItems: "center",
                            flexDirection: `${isMe ? "row-reverse" : "row"}`
                        }}>
                            <BadgeAvatar username={sender?.username || "Anonymous"} src={sender.avatar} sx={{ width: 24, height: 24 }} online={isOnline(sender._id)} />
                            <Message isMe={isMe} content={content} />
                            <MessageOptions
                                isMe={isMe}
                                content={content}
                                mess_id={mess_id}
                                selectedConversation={selectedConversation?.conversationId}
                                pinned={pinned} />
                        </Box>
                        <MessageStatus
                            listMessages={listMessages}
                            isMe={isMe}
                            readBy={readBy}
                            isLoading={isLoading}
                            index={index} />
                    </Box>
                </Box>)
            })}
            <Delete />
            <Edit />
        </Box>
    )
}