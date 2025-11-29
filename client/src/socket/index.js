import { store } from '../redux/app/store'
import { setUsersOnline, setNotifications, setConversations, setUnreadMessagePosition } from '../redux/features/eventSocket';
import { setListMessage, updateListMessage } from '../redux/features/chat'

export const initSocket = () => {
    const { socket } = store.getState().socket;
    
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
        store.dispatch(setNotifications(updatedNotifications));
    });

    socket.on("notification:new:friend:response", (data) => {
        const currentNotifications = store.getState().event.notifications;
        const newNotification = {
            title: "New friend response",
            content: data.content,
            reveal: data
        };
        const updatedNotifications = [...currentNotifications, newNotification];
        store.dispatch(setNotifications(updatedNotifications));
    });

    socket.on("notification:delete:friend:request", (data) => {
        let notifications = store.getState().event.notifications;
        notifications = notifications.filter(({reveal}) => {
            return reveal.id !== data.oldId.toString()
        })

        store.dispatch(setNotifications(notifications))
    })

    socket.on("conversation:new", (data) => {
        const currentConversations = store.getState().event.conversations;
        const newConversations = [...currentConversations, data]
        store.dispatch(setConversations(newConversations))
    })

    socket.on("notification:delete", (data) => {
        const curNotifications = store.getState().event.notifications;
        const newNotifications = curNotifications.filter(({ reveal: { id }}) => (
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
        const { selectedConversation, unreadMessagePosition } = store.getState().event
        const listMessages = store.getState().chat.listMessages
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

        if (_id.toString() !== data.sender._id.toString() && unreadMessagePosition === 0) {
            store.dispatch(setUnreadMessagePosition(1))
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

        store.dispatch(setUnreadMessagePosition(0))
        store.dispatch(setListMessage(newListMessages))
    })
}