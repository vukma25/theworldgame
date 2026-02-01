
import { createSlice } from '@reduxjs/toolkit'

const initialState = {
    usersOnline: [],
    conversations: [],
    notifications: [],
    selectedConversation: null //id_conversation
}

const eventSocket = createSlice({
    name: "event",
    initialState,
    reducers: {
        setUsersOnline: (state, action) => {
            state.usersOnline = action.payload
        },
        setConversations: (state, action) => {
            state.conversations = action.payload
        },
        setNotifications: (state, action) => {
            state.notifications = action.payload
        },
        selectConversation: (state, action) => {
            state.selectedConversation = action.payload
        }
    }
})

export const {
    setUsersOnline, setConversations, setNotifications, selectConversation,
    setUnreadMessagePosition
} = eventSocket.actions

export default eventSocket.reducer