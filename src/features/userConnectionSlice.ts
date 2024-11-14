import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axiosInstance from '../api/axios';
import { UserConnection } from '../types';

const BASE_URL = '/connections';

interface UserConnectionState {
    connections: UserConnection[];
    loading: boolean;
    error: string | null;
    success: string | null;
}

// Initial state
const initialState: UserConnectionState = {
    connections: [],
    loading: false,
    error: null,
    success: null,
};

// Async thunks
// Fetch connections
export const fetchUserConnections = createAsyncThunk(
    'userConnection/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`${BASE_URL}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch connections');
        }
    }
);

// Add a connection
export const addUserConnection = createAsyncThunk(
    'userConnection/add',
    async (userConnectionData: { connectionUsername: string }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`${BASE_URL}`, userConnectionData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to add connection');
        }
    }
);

// Remove a connection
export const removeUserConnection = createAsyncThunk(
    'userConnection/remove',
    async (userId: string, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete(`${BASE_URL}/${userId}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to remove connection');
        }
    }
);

// Slice
const userConnectionSlice = createSlice({
    name: 'userConnection',
    initialState,
    reducers: {
        resetMessages(state) {
            state.error = null;
            state.success = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch connections
        builder
            .addCase(fetchUserConnections.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUserConnections.fulfilled, (state, action: PayloadAction<any>) => {
                // state.error = null;
                state.connections = action.payload.connections;
                state.loading = false;
            })
            .addCase(fetchUserConnections.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                // state.success = null;
                state.loading = false;
            });

        // Add connection
        builder
            .addCase(addUserConnection.pending, (state) => {
                state.loading = true;
            })
            .addCase(addUserConnection.fulfilled, (state, action: PayloadAction<any>) => {
                state.connections.push(action.payload.newConnection);
                state.success = action.payload?.message || 'New connection added succesfully';
                // state.error = null;
                state.loading = false;
            })
            .addCase(addUserConnection.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                // state.success = null;
                state.loading = false;
            });

        // Remove connection
        builder
            .addCase(removeUserConnection.pending, (state) => {
                state.loading = true;
            })
            .addCase(removeUserConnection.fulfilled, (state, action: PayloadAction<any>) => {
                state.connections = state.connections.filter(connection => connection._id !== action.payload.id);
                state.success = action.payload?.message || 'Conncetion removed succesfully';
                // state.error = null;
                state.loading = false;
            })
            .addCase(removeUserConnection.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                // state.success = null;
                state.loading = false;
            });
    },
});

// Selectors
export const selectAllConnections = (state: RootState) => state.userConnection.connections;


// Export actions and reducer
export const { resetMessages } = userConnectionSlice.actions;
export default userConnectionSlice.reducer;
