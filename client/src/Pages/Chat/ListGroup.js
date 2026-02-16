import { Fragment, useEffect, useContext } from "react"
import { useDispatch, useSelector } from "react-redux"
import { Typography, List, ListItem, ListItemButton, Box } from "@mui/material"
import BadgeAvatar from "../../Components/BadgeAvatar/BadgeAvatar"
import api from "../../lib/api"
import { setConversations, selectConversation } from "../../redux/features/eventSocket"
import { setPinnedMessage } from "../../redux/features/chat"
import { useOnline } from "../../hook/useOnline"
import { StateContext } from "./Chat"

function Conversation({ avatar, name, count, lastMessage, conversationId, userId = null, pinnedMessage }) {
    const dispatch = useDispatch()
    const isOnline = useOnline()
    const { handleClose } = useContext(StateContext)

    function handleSelectConversation() {
        dispatch(selectConversation({ avatar, name, conversationId, read: count > 0 ? false : true, userId }))
    }

    function handleSetPinnedMessage() {
        dispatch(setPinnedMessage(pinnedMessage.map((m) => ({ ...m })).reverse()));
    }

    return (
        <ListItem disablePadding>
            <ListItemButton
                sx={{ gap: "1rem" }}
                onClick={() => {
                    handleClose(); handleSelectConversation(); handleSetPinnedMessage()
                }}
            >
                <BadgeAvatar username={name} src={avatar} online={isOnline(userId)} />
                <Box>
                    <Typography variant='h6'>{name}</Typography>
                    <Typography variant='body1' sx={{ color: "var(--ink-500)" }}>
                        {lastMessage ? `${lastMessage?.content.slice(0, 30)}${lastMessage?.content.length > 30 ? "..." : ""}` : "No message yet"}
                    </Typography>
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
    const { conversations } = useSelector((state) => state.event)
    const dispatch = useDispatch()

    useEffect(() => {
        async function fetchData() {
            const cons = await api.post('/conversation/all', { id: user._id }, { withCredentials: true })
            if (!cons.data) return;

            dispatch(setConversations(cons.data.conversations))
        }

        fetchData();
    }, [])

    return (
        <Fragment>
            <List>
                {conversations.map((group, index) => {
                    const { name, members, lastMessage, unread, type, _id, pinnedMessage } = group
                    const count = unread.find(({ user: id }) => id.toString() === user._id.toString())?.count

                    if (type === 'private') {
                        const { username, avatar, _id: userId } = members.find(({ _id }) => _id.toString() !== user._id.toString())

                        return (
                            <Conversation
                                key={index}
                                name={username}
                                avatar={avatar}
                                count={count}
                                lastMessage={lastMessage}
                                conversationId={_id}
                                userId={userId}
                                pinnedMessage={pinnedMessage}
                            />
                        )
                    } else {
                        return (
                            <Conversation
                                key={index}
                                name={name}
                                avatar={group.avatar}
                                count={count}
                                lastMessage={lastMessage}
                                conversationId={_id}
                                pinnedMessage={pinnedMessage}
                            />
                        )
                    }
                })}
            </List>
        </Fragment>
    )
}