import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import userConnectionAxios from '../api/userConnection';
import { UserConnection } from '../types';

interface UserConnectionState {
    connections: UserConnection[];
    loading: boolean;
    error: string | null;
}

// Initial state
const initialState: UserConnectionState = {
    connections: [],
    loading: false,
    error: null,
};

// Async thunks
// Fetch connections
export const fetchUserConnections = createAsyncThunk(
    'userConnection/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await userConnectionAxios.get('/');
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
            const { data } = await userConnectionAxios.post('/', userConnectionData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response.data);
        }
    }
);

// Remove a connection
export const removeUserConnection = createAsyncThunk(
    'userConnection/remove',
    async (userId: string, { rejectWithValue }) => {
        try {
            await userConnectionAxios.delete(`/${userId}`);
            return userId;
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
        resetError(state) {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Fetch connections
        builder
            .addCase(fetchUserConnections.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserConnections.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.connections = action.payload.connections;
            })
            .addCase(fetchUserConnections.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Add connection
        builder
            .addCase(addUserConnection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addUserConnection.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.connections.push(action.payload.newConnection);
            })
            .addCase(addUserConnection.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });

        // Remove connection
        builder
            .addCase(removeUserConnection.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(removeUserConnection.fulfilled, (state, action: PayloadAction<string>) => {
                state.loading = false;
                state.connections = state.connections.filter(connection => connection._id !== action.payload);
            })
            .addCase(removeUserConnection.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Selectors
export const selectAllConnections = (state: RootState) => state.userConnection.connections;


// Export actions and reducer
export const { resetError } = userConnectionSlice.actions;
export default userConnectionSlice.reducer;
