import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../lib/api'

export const sendRequestFriend = createAsyncThunk(
    'user/sendRequest',
    async ({ id, userId }, { rejectWithValue }) => {
        try {
            const response = await api.post(`/user/friendRequest/${userId}`,
                { id },
                { withCredentials: true })
            if (response.statusText !== 'OK') throw new Error('Error: send request friend failed');

            return response.data;
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

export const handleFriendRequest = createAsyncThunk(
    'user/handleRequest',
    async ({ userId, id, notificationId, response }, { rejectWithValue }) => {
        try {
            const res = await api.post('/user/friendRequest', {
                userId, id, notificationId, response
            }, { withCredentials: true })
            if (res.statusText !== 'OK') throw new Error('Error: handle request friend failed');

            if (response === 'accept') {
                const conv = await api.post('/conversation/create/private', {
                    members: [userId, id]
                }, { withCredentials: true })

                if (conv.statusText !== 'OK') throw new Error('Error: handle create conversation failed');
            }

            return res.data;
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

export const withdrawFriendRequest = createAsyncThunk(
    'user/withdrawRequest',
    async ({ me, another }, { rejectWithValue }) => {
        try {
            const response = await api.post("/user/friendRequest/withdraw", {
                me, another
            }, { withCredentials: true })

            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data.message)
        }
    }
)

export const unfriend = createAsyncThunk(
    "user/unfriend",
    async ({ me, another }, { rejectWithValue }) => {
        try {
            const response = await api.post("/user/unfriend", {
                me, another
            }, { withCredentials: true })

            return response.data
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
)

export const readNotification = createAsyncThunk(
    'notification/read',
    async ({ notificationId, id }, { rejectWithValue }) => {
        try {
            const response = await api.post('/notification/read', {
                notificationId, id
            }, { withCredentials: true })

            if (response.statusText !== 'OK') throw new Error('Error: read notification failed')

            return response.data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

export const deleteNotification = createAsyncThunk(
    'notification/delete',
    async ({ notificationId, id }, { rejectWithValue }) => {
        try {
            const response = await api.post('/notification/delete', {
                notificationId, id
            }, { withCredentials: true })

            if (response.statusText !== 'OK') throw new Error('Error: delete notification failed')

            return response.data
        } catch (err) {
            return rejectWithValue(err.message)
        }
    }
)

export const sendMessage = createAsyncThunk(
    'message/send',
    async ({ conversationId, content, sentAt, sender }, { rejectWithValue }) => {
        try {
            const response = await api.post('/message/send', {
                conversationId, content, sentAt, sender
            }, { withCredentials: true })

            if (response.status !== 200) throw new Error("Occur an error in sending process")

            return response.data
        } catch (err) {
            console.log(err)
            return rejectWithValue(err.message)
        }
    }
)

export const readMessage = createAsyncThunk(
    'message/read',
    async ({ conversationId, userId }, { rejectWithValue }) => {
        try {
            const response = await api.post('/message/read', {
                conversationId, userId
            }, { withCredentials: true })

            if (response.status !== 200) throw new Error("Occur an error in reading process")

            return response.data
        } catch (err) {
            console.log(err)
            return rejectWithValue(err.message)
        }
    }
)


const initialState = {
    isLoading: false,
    response: null,
    error: null
}

const userSlice = createSlice({
    name: 'user',
    initialState,
    extraReducers: (builder) =>
        builder
            .addCase(sendRequestFriend.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(sendRequestFriend.fulfilled, (state, action) => {
                state.isLoading = false
                state.response = action.payload
                state.error = null
            })
            .addCase(sendRequestFriend.rejected, (state, action) => {
                state.isLoading = false
                state.err = action.payload
            })
            .addCase(handleFriendRequest.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(handleFriendRequest.fulfilled, (state, action) => {
                state.isLoading = false
                state.response = action.payload
                state.error = null
            })
            .addCase(handleFriendRequest.rejected, (state, action) => {
                state.isLoading = false
                state.err = action.payload
            })
            .addCase(withdrawFriendRequest.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(withdrawFriendRequest.fulfilled, (state, action) => {
                state.isLoading = false
                state.response = action.payload
                state.error = null
            })
            .addCase(withdrawFriendRequest.rejected, (state, action) => {
                state.isLoading = false
                state.err = action.payload
            })
            .addCase(unfriend.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(unfriend.fulfilled, (state, action) => {
                state.isLoading = false
                state.response = action.payload
                state.error = null
            })
            .addCase(unfriend.rejected, (state, action) => {
                state.isLoading = false
                state.err = action.payload
            })
            .addCase(readNotification.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(readNotification.fulfilled, (state, action) => {
                state.isLoading = false
                state.response = action.payload
                state.error = null
            })
            .addCase(readNotification.rejected, (state, action) => {
                state.isLoading = false
                state.err = action.payload
            })
            .addCase(deleteNotification.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(deleteNotification.fulfilled, (state, action) => {
                state.isLoading = false
                state.response = action.payload
                state.error = null
            })
            .addCase(deleteNotification.rejected, (state, action) => {
                state.isLoading = false
                state.err = action.payload
            })
            .addCase(sendMessage.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(sendMessage.fulfilled, (state, action) => {
                state.isLoading = false
                state.response = action.payload
                state.error = null
            })
            .addCase(sendMessage.rejected, (state, action) => {
                state.isLoading = false
                state.err = action.payload
            })
            .addCase(readMessage.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(readMessage.fulfilled, (state, action) => {
                state.isLoading = false
                state.response = action.payload
                state.error = null
            })
            .addCase(readMessage.rejected, (state, action) => {
                state.isLoading = false
                state.err = action.payload
            })
})

export default userSlice.reducer