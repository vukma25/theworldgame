import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import api from "../../lib/api"

const initialState = {
    "user_information": null,
    "is_me": true,
    "current_relationship": "none",
    "friend_list_modal": false,
    "verify_modal": false,
    "mode": "view",
    "isLoading": false,
    "error": null
}

export const getMyProfile = createAsyncThunk(
    "profile/me",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("user/fetchMe/detail", { withCredentials: true })

            if (response.status !== 200) throw new Error("Get information failed")

            return response.data
        } catch (err) {
            console.log(err)
            return rejectWithValue(err.response.data.message)
        }
    }
)

export const getAnotherProfile = createAsyncThunk(
    "profile/another",
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await api.get(`user/fetchUser/${id}`, { withCredentials: true })

            if (response.status !== 200) throw new Error("Get information failed")

            return response.data
        } catch (err) {
            console.log(err)
            return rejectWithValue(err.response.data.message)
        }
    }
)

export const updateProfile = createAsyncThunk(
    "profile/update",
    async ({ id, username, email, bio, socialLinks }, { rejectWithValue }) => {
        try {
            const response = await api.post("user/update/profile", {
                id, username, email, bio, socialLinks
            }, { withCredentials: true })

            return response.data
        } catch (err) {
            console.log(err)
            return rejectWithValue(err.response.data.message)
        }
    }
)

const profileSlice = createSlice({
    name: "profile",
    initialState,
    reducers: {
        friendModal: (state, action) => {
            state.friend_list_modal = action.payload
        },
        verifyModal: (state, action) => {
            state.verify_modal = action.payload
        },
        setMode: (state, action) => {
            state.mode = action.payload
        },
        setAvatar: (state, action) => {
            state.user_information.avatar = action.payload
        }
    },
    extraReducers: (builder) =>
        builder
            .addCase(getMyProfile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getMyProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.user_information = action.payload.user
                state.is_me = true
            })
            .addCase(getMyProfile.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(getAnotherProfile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(getAnotherProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.user_information = action.payload.user
                state.is_me = false
            })
            .addCase(getAnotherProfile.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.isLoading = false
                state.user_information.username = action.payload.username
                state.user_information.email = action.payload.email
                state.user_information.bio = action.payload.bio
                state.user_information.socialLinks = action.payload.socialLinks
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            })
})


export const { friendModal, verifyModal, setMode, setAvatar } = profileSlice.actions
export default profileSlice.reducer