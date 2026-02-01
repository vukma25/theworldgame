import { store } from '../redux/app/store'
import { setUsersOnline, setNotifications, setConversations, selectConversation } from '../redux/features/eventSocket';
import { setListMessage, updateListMessage, setPinnedMessage } from '../redux/features/chat'
import { updateAvatar, updateFriendList } from '../redux/features/auth';
import { setAvatar } from '../redux/features/profile'

export const initSocket = () => {
    const { socket } = store.getState().socket;

    socket.on("connect", () => {
        console.log("Connected")
    })

    socket.on("user:online", (data) => {
        store.dispatch(setUsersOnline(data))
    })

    socket.on("notification:new:friend:request", (data) => {
        const currentNotifications = store.getState().event.notifications;
        const newNotification = {
            title: "New friend request",
            content: `${data.username} want to make friend`,
            reveal: data
        };
        const updatedNotifications = [...currentNotifications, newNotification];
        store.dispatch(setNotifications(updatedNotifications))
    });

    socket.on("notification:new:friend:response", (data) => {
        const { friendId } = data
        const currentNotifications = store.getState().event.notifications;
        const newNotification = {
            title: "New friend response",
            content: data.content,
            reveal: data
        };
        const updatedNotifications = [...currentNotifications, newNotification];
        store.dispatch(setNotifications(updatedNotifications));
        if (friendId) {
            store.dispatch(updateFriendList(friendId))
        }
    });

    socket.on("notification:delete:friend:request", (data) => {
        const { friendId } = data
        let notifications = store.getState().event.notifications;
        notifications = notifications.filter(({ reveal }) => {
            return reveal.id !== data.oldId.toString()
        })

        store.dispatch(setNotifications(notifications))
        if (friendId) {
            store.dispatch(updateFriendList(friendId))
        }
    })

    socket.on("conversation:new", (data) => {
        const currentConversations = store.getState().event.conversations;
        const newConversations = [...currentConversations, data]
        store.dispatch(setConversations(newConversations))
    })

    socket.on("notification:delete", (data) => {
        const curNotifications = store.getState().event.notifications;
        const newNotifications = curNotifications.filter(({ reveal: { id } }) => (
            id !== data.notificationId
        ))

        store.dispatch(setNotifications(newNotifications))
    })

    socket.on("notification:read", (data) => {
        const curNotifications = store.getState().event.notifications;
        const newNotifications = curNotifications.map((no) => {
            if (no.reveal.id === data.notificationId) {
                return {
                    ...no,
                    reveal: {
                        ...no.reveal,
                        unread: false
                    }
                }
            }
            return no
        })
        store.dispatch(setNotifications(newNotifications))
    })

    socket.on("message:new", (data) => {
        const conversations = store.getState().event.conversations
        const { selectedConversation } = store.getState().event
        const _id = store.getState().auth.user._id

        const newConversations = conversations.map(con => {
            if (con._id.toString() === data.conversationId.toString()) {
                return {
                    ...con,
                    lastMessage: {
                        content: data.content
                    }
                }
            } return con
        })
        store.dispatch(setConversations(newConversations))

        if (_id.toString() !== data.sender._id.toString() && selectedConversation.read) {
            store.dispatch(selectConversation({
                ...selectedConversation,
                read: false
            }))
        }

        if (selectedConversation) {
            const match = selectedConversation.conversationId.toString() === data.conversationId.toString()
            if (match) {
                store.dispatch(updateListMessage(data))
            }
        }
    })

    socket.on("unread:update", (data) => {
        const conversations = store.getState().event.conversations
        const userId = store.getState().auth.user._id

        const newConversations = conversations.map(con => {
            if (con._id.toString() === data.conversationId.toString()) {
                const newCon = { ...con }
                newCon.unread = newCon.unread.map((e) => {
                    if (e.user.toString() === userId.toString()) {
                        return {
                            ...e,
                            count: data.unread
                        }
                    }
                    return e
                })
                return newCon
            } return con
        })
        store.dispatch(setConversations(newConversations))
    })

    socket.on("message:read", (data) => {
        const { userReadMessage, count } = data
        const { selectedConversation } = store.getState().event
        const listMessages = store.getState().chat.listMessages

        if (!count) return

        const newListMessages = listMessages.map((message, index) => {
            if (index >= listMessages.length - count) {
                return {
                    ...message,
                    readBy: [...message.readBy, userReadMessage]
                }
            }
            return message
        })

        store.dispatch(selectConversation({
            ...selectedConversation,
            read: true
        }))
        store.dispatch(setListMessage(newListMessages))
    })

    socket.on("message:edit", (data) => {
        const { messageId, newContent } = data;

        const { listMessages } = store.getState().chat

        const updateListMessage = listMessages.map(mess => {
            const { _id } = mess
            if (_id.toString() === messageId.toString()) {
                return {
                    ...mess,
                    content: newContent
                }
            }
            return { ...mess }
        })

        store.dispatch(setListMessage(updateListMessage))
    })

    socket.on("message:delete", (data) => {
        console.log("Catched event")
        const { deletedMessageId, isPin } = data;

        const { listMessages, listPinnedMessages } = store.getState().chat

        const updateListMessage = listMessages.filter(({ _id }) => _id.toString() !== deletedMessageId.toString())
        if (isPin) {
            const updatePinnedMessage = listPinnedMessages.filter(({ _id }) => _id.toString() !== deletedMessageId.toString())
            store.dispatch(setPinnedMessage(updatePinnedMessage))
        }

        store.dispatch(setListMessage(updateListMessage))
    })

    socket.on("message:pin", (data) => {
        const { messageId } = data
        const { listMessages, listPinnedMessages } = store.getState().chat
        let updatePinnedMessage = []

        const updateListMessage = listMessages.map((mess) => {
            const { _id, content, sentAt, sender } = mess
            if (_id.toString() === messageId) {

                updatePinnedMessage = [{ _id, content, sentAt, sender }, ...listPinnedMessages]

                return {
                    ...mess,
                    pinned: true
                }
            }
            return mess
        })

        store.dispatch(setListMessage(updateListMessage))
        store.dispatch(setPinnedMessage(updatePinnedMessage))
    })

    socket.on("message:un:pin", (data) => {
        const { messageId } = data
        const { listMessages, listPinnedMessages } = store.getState().chat
        let updatePinnedMessage = []

        const updateListMessage = listMessages.map((mess) => {
            const { _id, content, sentAt, sender } = mess
            if (_id.toString() === messageId) {

                updatePinnedMessage = listPinnedMessages.filter(({ _id }) => _id.toString() !== messageId.toString())

                return {
                    ...mess,
                    pinned: false
                }
            }
            return mess
        })

        store.dispatch(setListMessage(updateListMessage))
        store.dispatch(setPinnedMessage(updatePinnedMessage))
    })

    socket.on("upload:avatar", (data) => {
        store.dispatch(updateAvatar(data.url))
        store.dispatch(setAvatar(data.url))
    })
}