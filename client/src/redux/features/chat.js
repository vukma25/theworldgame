import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../lib/api";

const initialState = {
    action: "",
    listMessages: [],
    listPinnedMessages: [],
    myself: false,
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
    fetchError: null,
    hasMore: false,
    unreadCount: 0
}

export const handleLoadFirstMessage = createAsyncThunk(
    'chat/loadFirstMessage',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await api.get(`/message/first/${id}`, { withCredentials: true })

            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data.message)
        }
    }
)

export const handleLoadMoreMessage = createAsyncThunk(
    'chat/loadMoreMessage',
    async ({ skip, limit, id }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/message/more/${id}`, {
                skip, limit
            }, { withCredentials: true })

            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data.message)
        }
    }
)

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
        setMyself: (state, action) => {
            state.myself = action.payload
        },
        updateListMessage: (state, action) => {
            state.listMessages.push(action.payload)
            state.action = "new"
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
        },
        setUnreadCount: (state, action) => {
            state.unreadCount = action.payload
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(handleEditMessage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(handleEditMessage.fulfilled, (state) => {
                state.isLoading = false
                state.fetchError = null
            })
            .addCase(handleEditMessage.rejected, (state, action) => {
                state.isLoading = false
                state.fetchError = action.payload
            })
            .addCase(handleDeleteMessage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(handleDeleteMessage.fulfilled, (state) => {
                state.isLoading = false
                state.deleteDialog.conversation = null
                state.deleteDialog.message = null
                state.deleteDialog.open = false
                state.fetchError = null
            })
            .addCase(handleDeleteMessage.rejected, (state, action) => {
                state.isLoading = false
                state.fetchError = action.payload
            })
            .addCase(handlePinMessage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(handlePinMessage.fulfilled, (state) => {
                state.isLoading = false
                state.fetchError = null
            })
            .addCase(handlePinMessage.rejected, (state, action) => {
                state.isLoading = false
                state.fetchError = action.payload
            })
            .addCase(handleUnPinMessage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(handleUnPinMessage.fulfilled, (state) => {
                state.isLoading = false
                state.fetchError = null
            })
            .addCase(handleUnPinMessage.rejected, (state, action) => {
                state.isLoading = false
                state.fetchError = action.payload
            })
            .addCase(handleLoadMoreMessage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(handleLoadMoreMessage.fulfilled, (state, action) => {
                state.isLoading = false
                state.fetchError = null

                const messes = [...action.payload.messages.reverse(), ...state.listMessages]
                state.listMessages = messes
                state.hasMore = action.payload.totalMessages > messes.length
            })
            .addCase(handleLoadMoreMessage.rejected, (state, action) => {
                state.isLoading = false
                state.fetchError = action.payload
            })
            .addCase(handleLoadFirstMessage.pending, (state) => {
                state.isLoading = true
            })
            .addCase(handleLoadFirstMessage.fulfilled, (state, action) => {
                state.isLoading = false
                state.fetchError = null
                state.listMessages = action.payload.messages.reverse()
                state.hasMore = action.payload.hasMore
                state.unreadCount = action.payload.unread
            })
            .addCase(handleLoadFirstMessage.rejected, (state, action) => {
                state.isLoading = false
                state.fetchError = action.payload
            })
    }
})

export const {
    updateListMessage, setListMessage,
    setDeleteDialog, setEditDialog, setPinnedMessage, setUnreadCount, setMyself
} = chatSlice.actions
export default chatSlice.reducer