import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/api";

const initialState = {
    sidebar: true,
    action: "",
    content: "",
    listMessages: [],
    listPinnedMessages: [],
    error: {
        isError: false,
        reason: ''
    },
    deleteDialog: {
        conversation: null,
        message: null,
        open: false
    },
    editDialog: {
        conversation: null,
        message: null,
        content: null,
        open: false
    },
    isLoading: false,
}


export const handleEditMessage = createAsyncThunk(
    'chat/edit',
    async ({ conversationId, messageId, newContent }, { rejectWithValue }) => {
        try {
            const response = await api.post('/message/edit', {
                conversationId, messageId, newContent
            }, { withCredentials: true })

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const handleDeleteMessage = createAsyncThunk(
    'chat/delete',
    async ({ conversationId, messageId }, { rejectWithValue }) => {
        try {
            const response = await api.post('/message/delete', {
                conversationId, messageId
            }, { withCredentials: true })

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const handlePinMessage = createAsyncThunk(
    "chat/pin",
    async ({ messageId, conversationId }, { rejectWithValue }) => {
        try {
            const response = await api.post("/message/pin", {
                messageId, conversationId
            }, { withCredentials: true })

            return response.data
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    }
)

export const handleUnPinMessage = createAsyncThunk(
    "chat/unpin",
    async ({ messageId, conversationId }, { rejectWithValue }) => {
        try {
            const response = await api.post("/message/unpin", {
                messageId, conversationId
            }, { withCredentials: true })

            return response.data
        } catch (err) {
            return rejectWithValue(err.response.data.message);
        }
    }
)


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
            state.action = "new"
        },
        raiseError: (state, action) => {
            state.error = action.payload
        },
        setListMessage: (state, action) => {
            state.listMessages = action.payload
            state.action = ""
        },
        setDeleteDialog: (state, action) => {
            state.deleteDialog = action.payload
        },
        setEditDialog: (state, action) => {
            state.editDialog = action.payload
        },
        setPinnedMessage: (state, action) => {
            state.listPinnedMessages = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleEditMessage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(handleEditMessage.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(handleEditMessage.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(handleDeleteMessage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(handleDeleteMessage.fulfilled, (state) => {
                state.isLoading = false
                state.deleteDialog.conversation = null
                state.deleteDialog.message = null
                state.deleteDialog.open = false
            })
            .addCase(handleDeleteMessage.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(handlePinMessage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(handlePinMessage.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(handlePinMessage.rejected, (state) => {
                state.isLoading = false
            })
            .addCase(handleUnPinMessage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(handleUnPinMessage.fulfilled, (state) => {
                state.isLoading = false
            })
            .addCase(handleUnPinMessage.rejected, (state) => {
                state.isLoading = false
            })
    }
})

export const { setSidebar, setContent, updateListMessage, setListMessage, raiseError,
    setDeleteDialog, setEditDialog, setPinnedMessage
} = chatSlice.actions
export default chatSlice.reducer