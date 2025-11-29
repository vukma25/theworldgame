
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api'

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await api.post('/auth/login', {
                email, password
            }, { withCredentials: true })

            return response.data;
        } catch (error) {
            console.log(error)
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const { username, password, email } = userData
            const response = await api.post('/auth/register', { username, password, email });

            if (response.statusText !== 'Created') throw new Error('Error: register failed');

            return response.data;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post("/auth/logout", {data: "test"}, { withCredentials: true })

            //if (response.status !== 200) { throw new Error('Error: logout failed') }
            return true;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refresh',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post('/auth/refresh', {}, { withCredentials: true });

            if (response.statusText !== 'OK') throw new Error('Error: refresh token failed');
            const data = response.data;

            return data.accessToken;
        } catch (error) {
            return rejectWithValue(error.response.data.message);
        }
    }
);

export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/user/fetchUser')

            if (response.statusText !== 'OK') throw new Error("In maintaining process")

            return response.data.user
        } catch (error) {
            return rejectWithValue(error);
        }
    }
)

// Auth Slice
const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: null,
        accessToken: null,
        isLoading: false,
        error: null,
        isAuthenticated: false
    },
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        setAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Login
            .addCase(loginUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(loginUser.rejected, (state, action) => {
                console.log(action.payload)
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Register
            .addCase(registerUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state) => {
                state.isLoading = false;
                state.error = null;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
            })
            // Refresh Token
            .addCase(refreshToken.pending, (state) => {
                state.isLoading = true
            })
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.accessToken = action.payload;
                state.isLoading = false;
                state.isAuthenticated = true;
            })
            .addCase(refreshToken.rejected, (state) => {
                state.isLoading = false;
                state.isAuthenticated = false;
            })
            .addCase(fetchUser.pending, (state) => {
                state.isLoading = true
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
                state.isLoading = false
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.isLoading = false
                state.error = action.payload
            });
    }
});

export const { clearError, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;