import React, { useState, useMemo, useLayoutEffect, useCallback, useEffect, useRef, Fragment } from "react"
import { useSelector, useDispatch } from "react-redux"
import { Box, Typography, CircularProgress, Badge, Chip } from "@mui/material"
import { Sms } from "@mui/icons-material"
import moment from "moment/moment"
import BadgeAvatar from "../../../Components/BadgeAvatar/BadgeAvatar"
import Message from "../Element/Message"
import MessageStatus from "../Element/MessageStatus"
import MessageOptions from "../Element/MessageOptions"
import PinnedMessages from "./PinnedMessages"
import Delete from "../Dialog/Delete"
import Edit from "../Dialog/Edit"
import { readMessage } from "../../../redux/features/user"
import { handleLoadMoreMessage, handleLoadFirstMessage, setMyself, setUnreadCount } from "../../../redux/features/chat"
import { useOnline } from "../../../hook/useOnline"
import useInfiniteScroll from "react-infinite-scroll-hook"
import MessageSkeleton from "../../../Components/Skeleton/MessageSkeleton"

const LIMIT = 20
const JUMP = 100
let PROCESSING = false

function ChatBox() {
    const {
        listMessages, listPinnedMessages, action, myself,
        isLoading: loading, fetchError, hasMore, unreadCount, preViewMessage
    } = useSelector((state) => state.chat)
    const { user: { _id } } = useSelector((state) => state.auth)
    const { selectedConversation } = useSelector((state) => state.event)
    const { isLoading } = useSelector((state) => state.user)
    const { socket } = useSelector((state) => state.socket)
    const dispatch = useDispatch()

    const bottomRef = useRef(null)
    const isOnline = useOnline()
    const scrollableRootRef = useRef(null)
    const lastScrollDistanceToBottomRef = useRef(0)
    const [highlight, setHighlight] = useState(null)

    const getMoreMessage = useCallback((l = LIMIT) => {
        try {
            dispatch(handleLoadMoreMessage({
                skip: listMessages.length,
                limit: l,
                id: selectedConversation?.conversationId
            }))
        } catch (error) {
            console.log("Can't get more message")
        }
    }, [listMessages])

    const [infiniteRef, { rootRef }] = useInfiniteScroll({
        loading,
        hasNextPage: hasMore,
        onLoadMore: getMoreMessage,
        disabled: !!fetchError,
    });

    async function loadUnreadMessages() {
        if (loading || unreadCount === 0) return
        try {
            await getMoreMessage(unreadCount + 5).unwrap()
            dispatch(setUnreadCount(0))
        } catch (error) {
            console.log("Can't load more message")
        }

    }

    useEffect(() => {
        if (selectedConversation?.conversationId) {
            const { conversationId } = selectedConversation
            dispatch(handleLoadFirstMessage({ id: conversationId.toString() }))

        }
    }, [selectedConversation?.conversationId])

    useEffect(() => {
        if (selectedConversation?.conversationId && listMessages.length !== 0) {
            const { conversationId } = selectedConversation
            const userId = _id
            const id = listMessages[0].conversationId
            const match = id.toString() === conversationId.toString()

            if (match && !selectedConversation.read) {
                dispatch(readMessage({ conversationId, userId }))
            }
        }
    }, [listMessages, selectedConversation?.conversationId])

    useEffect(() => {
        lastScrollDistanceToBottomRef.current = 0
    }, [selectedConversation?.conversationId])

    useEffect(() => {
        if (bottomRef.current && action === "new") {
            if (lastScrollDistanceToBottomRef.current > 580 && !myself) {
                scrollableRootRef.current.scrollTop =
                    scrollableRootRef.current.scrollHeight - lastScrollDistanceToBottomRef.current - 75;

                dispatch(setMyself(false))
            } else {
                bottomRef.current.scrollIntoView({
                    block: "end"
                })
            }
        }
    }, [action, myself])

    useLayoutEffect(() => {
        const scrollableRoot = scrollableRootRef.current;
        const lastScrollDistanceToBottom = lastScrollDistanceToBottomRef.current
        if (scrollableRoot) {
            scrollableRoot.scrollTop =
                scrollableRoot.scrollHeight - lastScrollDistanceToBottom
        }
    }, [listMessages, rootRef]);

    const rootRefSetter = useCallback(
        (node) => {
            rootRef(node);
            scrollableRootRef.current = node;
        },
        [rootRef],
    );

    const handleRootScroll = useCallback(() => {
        const rootNode = scrollableRootRef.current
        if (rootNode) {
            const scrollDistanceToBottom = rootNode.scrollHeight - rootNode.scrollTop
            lastScrollDistanceToBottomRef.current = scrollDistanceToBottom
        }
    }, []);

    const pinnedMessageRefs = useRef({})

    useEffect(() => {
        pinnedMessageRefs.current = {};

        listPinnedMessages.forEach(message => {
            pinnedMessageRefs.current[message._id.toString()] = React.createRef();
        });
    }, [listPinnedMessages]);

    const scrollToPinnedMessage = useCallback(async (id) => {
        if (loading || PROCESSING) return
        try {
            setHighlight(null)
            let list = listMessages.map((m) => ({ ...m }))
            while (!list.find(({ _id }) => _id.toString() === id)) {
                PROCESSING = true
                const res = await dispatch(handleLoadMoreMessage({
                    skip: list.length,
                    limit: JUMP || 100,
                    id: selectedConversation?.conversationId
                })).unwrap()
                list = [...res.messages.reverse(), ...list]
            }

            const targetRef = pinnedMessageRefs.current[id];
            if (targetRef?.current) {
                targetRef.current.scrollIntoView({
                    block: "center"
                })
                setHighlight(id)
                return
            }

        } catch (error) {
            console.log("Can't get pinned message")
        } finally {
            PROCESSING = false
        }
    }, [listMessages]);

    const clusterMessagePerDay = useMemo(() => {
        const cluster = {}
        listMessages.forEach((mess) => {
            const day = moment(mess?.sentAt).format('DD/MM/YYYY')
            if (!cluster[day]) { cluster[day] = [] }
            cluster[day].push(mess)
        })

        return cluster
    }, [listMessages])

    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                flexGrow: 1,
                p: listPinnedMessages.length === 0
                    ? 2 : "8rem 2rem 2rem 2rem",
                overflowY: 'auto',
                gap: ".5rem",
                '&::-webkit-scrollbar': {
                    width: '.6rem'
                },
                '&::-webkit-scrollbar-thumb': {
                    background: 'var(--cl-primary-blue)',
                    borderRadius: ".4rem"
                },
                '&::-webkit-scrollbar-track': {
                    background: 'transparent'
                }
            }}
            ref={rootRefSetter}
            onScroll={handleRootScroll}
        >
            {hasMore && <CircularProgress
                ref={infiniteRef} size={20} />}
            {listPinnedMessages.length !== 0 && <PinnedMessages messages={listPinnedMessages} func={scrollToPinnedMessage} />}
            {Object.entries(clusterMessagePerDay).map(([day, messes]) => {
                return (
                    <Box key={day} sx={{ width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: ".5rem" }}>
                        <Chip label={day} />
                        {messes.map(({ _id: mess_id, content, sender, sentAt, readBy, pinned, edited, contentType }, index) => {
                            const animate = mess_id.toString() === highlight
                            const isMe = sender._id.toString() === _id.toString()
                            return (<Box
                                key={mess_id}
                                sx={{
                                    width: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: isMe ? 'flex-end' : 'flex-start',
                                    mb: 1,
                                }}
                            >
                                <Box sx={{ display: "flex", flexDirection: "column", gap: ".5rem" }}>
                                    {/* <Typography sx={{ textAlign: `${isMe ? "end" : "start"}`, fontSize: ".8rem" }}>{moment(sentAt).format('DD/MM/YYYY - hh:mm')}</Typography> */}
                                    <Box sx={{
                                        display: "flex", gap: ".5rem", alignItems: "start",
                                        flexDirection: `${isMe ? "row-reverse" : "row"}`
                                    }}>
                                        <BadgeAvatar username={sender?.username || "Anonymous"} src={sender.avatar} sx={{ width: 24, height: 24 }} online={isOnline(sender._id)} />
                                        <Message
                                            refer={pinnedMessageRefs.current[mess_id]}
                                            isMe={isMe} content={content} animate={animate}
                                            sentAt={sentAt} username={sender?.username || "Anonymous"}
                                            contentType={contentType} />
                                        <MessageOptions
                                            isMe={isMe} content={content} mess_id={mess_id}
                                            selectedConversation={selectedConversation?.conversationId}
                                            pinned={pinned} contentType={contentType} />
                                    </Box>
                                    <MessageStatus
                                        listMessages={listMessages} isMe={isMe} readBy={readBy}
                                        isLoading={isLoading} edited={edited} index={index}
                                    />
                                </Box>
                            </Box>)
                        })}
                    </Box>
                )
            })}
            {Object.entries(preViewMessage).map(([id, process]) => {
                return <MessageSkeleton key={id} process={process} />
            })}
            <div ref={bottomRef}></div>
            {unreadCount > 0 && <Badge
                badgeContent={unreadCount}
                color="warning"
                max={99}
                style={{ position: "fixed", bottom: 100, right: 25, zIndex: 50 }}
                onClick={loadUnreadMessages}
            >
                <Sms color="action" sx={{ fontSize: "3rem", color: "var(--cl-primary-blue)" }} />
            </Badge>}
            <Delete />
            <Edit />
        </Box>
    )
}

export default React.memo(ChatBox)