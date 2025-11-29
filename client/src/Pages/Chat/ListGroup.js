import { Fragment, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { setSidebar } from "../../redux/features/chat"
import { Typography, List, ListItem, ListItemButton, Avatar, Box } from "@mui/material"
import BadgeAvatar from "../../Components/BadgeAvatar/BadgeAvatar"
import api from "../../lib/api"
import { setConversations, selectConversation } from "../../redux/features/eventSocket"
import { setListMessage } from "../../redux/features/chat"

function Conversation({ avatar, name, count, latestMessage, conversationId }) {
    const dispatch = useDispatch()

    function handleSidebar() {
        dispatch(setSidebar(false))
    }

    function handleSelectConversation() {
        dispatch(selectConversation({ avatar, name, conversationId }))
    }

    return (
        <ListItem disablePadding>
            <ListItemButton
                sx={{ gap: "1rem" }}
                onClick={() => {
                    handleSidebar(); handleSelectConversation()
                }}
            >
                <BadgeAvatar username={name} src={avatar} online={null}/>
                <Box>
                    <Typography variant='h6'>{name}</Typography>
                    <Typography variant='body1' sx={{ color: "var(--ink-500)" }}>{latestMessage}</Typography>
                </Box>
                {count !== 0 &&
                    <Typography
                        variant='h6'
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            background: "var(--ink-500)",
                            width: "1.6rem",
                            height: "1.6rem",
                            borderRadius: "50%",
                            fontSize: ".8rem",
                            color: "var(--cl-white-pure)",
                            marginLeft: "auto"
                        }}
                    >{count < 9 ? count : "9+"}</Typography>}
            </ListItemButton>
        </ListItem>
    )
}

export default function ListGroup() {
    const { user } = useSelector((state) => state.auth)
    const { conversations, selectedConversation } = useSelector((state) => state.event)
    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchData() {
            const cons = await api.post('/conversation/all', { id: user._id }, { withCredentials: true })
            if (!cons.data) return;

            dispatch(setConversations(cons.data.conversations))
        }

        fetchData();
    }, [])

    useEffect(() => {
        if (selectedConversation) {
            const { conversationId } = selectedConversation

            async function getAllMessages() {
                const response = await api.post(`/message/all/${conversationId.toString()}`, {}, { withCredentials: true })
                if (!response?.data?.messages) return

                dispatch(setListMessage(response.data.messages.reverse()))
            }

            getAllMessages()
        }
    }, [selectedConversation])

    return (
        <Fragment>
            <List>
                {conversations.map((group, index) => {
                    const { name, members, latestMessage, unread, type, _id } = group
                    const count = unread.find(({ user: id }) => id.toString() === user._id.toString())?.count

                    if (type === 'private') {
                        const { username, avatar } = members.find(({ _id }) => _id.toString() !== user._id.toString())

                        return (
                            <Conversation
                                key={index}
                                name={username}
                                avatar={avatar}
                                count={count}
                                latestMessage={latestMessage}
                                conversationId={_id}
                            />
                        )
                    } else {
                        return (
                            <Conversation
                                key={index}
                                name={name}
                                avatar={group.avatar}
                                count={count}
                                latestMessage={latestMessage}
                                conversationId={_id}
                            />
                        )
                    }
                })}
            </List>
        </Fragment>
    )
}