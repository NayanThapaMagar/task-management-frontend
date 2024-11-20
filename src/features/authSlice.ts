import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../api/axios';
import { initializeSocket, destroySocket } from '../socktes/socket';

const BASE_URL = '/auth';

interface AuthState {
    user: any;
    token: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: AuthState = {
    user: null,
    token: localStorage.getItem('token'),
    loading: false,
    error: null,
};

// Register User
export const register = createAsyncThunk(
    'auth/register',
    async (credentials: { username: string; email: string; password: string }, thunkAPI) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/register`, credentials);
            const { token, user } = response.data;

            // Save token to localStorage
            localStorage.setItem('token', token);
            initializeSocket(token);

            return { token, user };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Registration failed');
        }
    }
);

// Login User
export const login = createAsyncThunk(
    'auth/login',
    async (credentials: { email: string; password: string }, thunkAPI) => {
        try {
            const response = await axiosInstance.post(`${BASE_URL}/login`, credentials);
            const { token, user } = response.data;

            // Save token to localStorage
            localStorage.setItem('token', token);
            initializeSocket(token);

            return { token, user };
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response?.data?.message || 'Login failed');
        }
    }
);

// Logout User
export const logout = createAsyncThunk('auth/logout', async (_, thunkAPI) => {
    try {
        localStorage.removeItem('token');
        destroySocket();
        return;
    } catch (error: any) {
        return thunkAPI.rejectWithValue('Logout failed');
    }
});

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Register Cases
            .addCase(register.pending, (state) => {
                state.loading = true;
            })
            .addCase(register.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(register.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Login Cases
            .addCase(login.pending, (state) => {
                state.loading = true;
            })
            .addCase(login.fulfilled, (state, action) => {
                state.loading = false;
                state.token = action.payload.token;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(login.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })

            // Logout Cases
            .addCase(logout.fulfilled, (state) => {
                state.user = null;
                state.token = null;
            })
            .addCase(logout.rejected, (state, action) => {
                state.error = action.payload as string;
            });
    },
});

export default authSlice.reducer;
