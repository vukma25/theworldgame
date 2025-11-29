import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    sidebar: true,
    content: "",
    listMessages: [],
    error: {
        isError: false,
        reason: ''
    }
}

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {
        setSidebar: (state, action) => {
            state.sidebar = action.payload
        },
        setContent: (state, action) => {
            state.content = action.payload
        },
        updateListMessage: (state, action) => {
            state.listMessages.push(action.payload)
        },
        raiseError: (state, action) => {
            state.error = action.payload
        },
        setListMessage: (state, action) => {
            state.listMessages = action.payload
        }
    }
})

export const { setSidebar, setContent, updateListMessage, setListMessage, raiseError } = chatSlice.actions
export default chatSlice.reducer