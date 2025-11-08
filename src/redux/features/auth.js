
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/api'

export const loginUser = createAsyncThunk(
    'auth/login',
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await fetch('http://localhost:4000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const registerUser = createAsyncThunk(
    'auth/register',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await fetch(`http://localhost:4000/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(userData),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const logoutUser = createAsyncThunk(
    'auth/logout',
    async (_, { rejectWithValue }) => {
        try {
            // await fetch('http://localhost:4000/api/auth/logout', {
            //     method: 'POST',
            //     headers: {
            //         'Content-Type': 'application/json',
            //         'Authorization': `Bearer ${accessToken}`
            //     },
            //     body: JSON.stringify({ message: 'ok'}),
            //     credentials: 'include'
            // });

            await api.post("http://localhost:4000/api/auth/logout", {data: "test"}, { withCredentials: true })
            return true;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refresh',
    async (_, { rejectWithValue, dispatch }) => {
        try {
            const response = await api.post('http://localhost:4000/api/auth/refresh', {}, { withCredentials: true });

            const data = await response.json();
            if (!response.ok) throw new Error(data.message);

            if (data.accessToken) {
                dispatch(fetchUser());
            }

            return data.accessToken;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const fetchUser = createAsyncThunk(
    'auth/fetchUser',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('http://localhost:4000/api/user/fetchUser')

            const data = await response.json();
            if (!response.ok) throw new Error("In maintaining process")

            return data.user
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
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })
            // Register
            .addCase(registerUser.fulfilled, (state, action) => {
                state.user = action.payload.user;
                state.isAuthenticated = true;
            })
            // Logout
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                state.isAuthenticated = false;
            })
            // Refresh Token
            .addCase(refreshToken.fulfilled, (state, action) => {
                state.accessToken = action.payload;
            })
            .addCase(refreshToken.rejected, (state) => {
                state.isAuthenticated = false;
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.user = action.payload;
            });
    }
});

export const { clearError, setAuthenticated } = authSlice.actions;
export default authSlice.reducer;