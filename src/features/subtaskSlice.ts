import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axiosInstance from '../api/axios';
import { SubTask } from '../types';

const BASE_URL = '/subtasks';

interface SubtaskState {
    subtasks: SubTask[];
    mySubtasks: SubTask[];
    assignedSubtasks: SubTask[];
    loading: boolean;
    error: string | null;
    success: string | null;
    totalSubtasks: number;
    totalPages: number;
    selectedSubtask: SubTask | null;
}

// Initial state
const initialState: SubtaskState = {
    subtasks: [],
    mySubtasks: [],
    assignedSubtasks: [],
    loading: false,
    error: null,
    success: null,
    totalSubtasks: 0,
    totalPages: 0,
    selectedSubtask: null,
};

// Async actions
export const fetchAllSubtasks = createAsyncThunk(
    'subtasks/fetchAll',
    async ({ taskId, params }: { taskId: string, params: { page: number; limit: number; status?: string; priority?: string } }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`${BASE_URL}/${taskId}`, { params });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching subtasks');
        }
    }
);

export const fetchMySubtasks = createAsyncThunk(
    'subtasks/fetchMySubtasks',
    async ({ taskId, params }: { taskId: string, params: { page: number; limit: number; status?: string; priority?: string } }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`${BASE_URL}/${taskId}/my-subtasks`, { params });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching assigned subtasks');
        }
    }
);
export const fetchAssignedSubtasks = createAsyncThunk(
    'subtasks/fetchAssignedSubtasks',
    async ({ taskId, params }: { taskId: string, params: { page: number; limit: number; status?: string; priority?: string } }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`${BASE_URL}/${taskId}/assigned-subtasks`, { params });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching assigned subtasks');
        }
    }
);

// Fetch subtask by ID
export const fetchSubtaskById = createAsyncThunk(
    'subtasks/fetchById',
    async ({ taskId, subtaskId }: { taskId: string, subtaskId: string }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`${BASE_URL}/${taskId}/${subtaskId}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching subtask');
        }
    }
);

export const createSubtask = createAsyncThunk(
    'subtasks/create',
    async ({ taskId, subtaskData }: { taskId: string, subtaskData: { title: string; description: string; priority: string; assignedTo: string[] } }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`${BASE_URL}/${taskId}`, subtaskData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error creating subtask');
        }
    }
);

export const updateSubtask = createAsyncThunk(
    'subtasks/update',
    async ({ taskId, subtaskId, updates }: { taskId: string, subtaskId: string; updates: { title?: string; description?: string; priority?: string; assignedTo?: string[] } }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.put(`${BASE_URL}/${taskId}/${subtaskId}`, updates);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error updating subtask');
        }
    }
);

export const deleteSubtask = createAsyncThunk(
    'subtasks/delete',
    async ({ taskId, subtaskId }: { taskId: string, subtaskId: string }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete(`${BASE_URL}/${taskId}/${subtaskId}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error deleting subtask');
        }
    }
);

// Update subtask status
export const updateSubtaskStatus = createAsyncThunk(
    'subtasks/updateStatus',
    async ({ taskId, subtaskId, status }: { taskId: string, subtaskId: string; status: string }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`${BASE_URL}/${taskId}/${subtaskId}/status`, { status });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error updating subtask status');
        }
    }
);

// Add comment to subtask
export const addSubtaskComment = createAsyncThunk(
    'subtasks/addComment',
    async ({ taskId, subtaskId, text }: { taskId: string, subtaskId: string; text: string }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`${BASE_URL}/${taskId}/${subtaskId}/comments`, { text });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error adding comment');
        }
    }
);

// Subtask slice
const subtaskSlice = createSlice({
    name: 'subtasks',
    initialState,
    reducers: {
        resetMessages(state) {
            state.error = null;
            state.success = null;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        setAssignedSubtasks: (state, action: PayloadAction<SubTask[]>) => {
            state.assignedSubtasks = action.payload;
        },
        setSelectedSubtask: (state, action: PayloadAction<SubTask>) => {
            state.selectedSubtask = action.payload;
        },
        resetSelectedSubtask: (state) => {
            state.selectedSubtask = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all subtasks
            .addCase(fetchAllSubtasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllSubtasks.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.subtasks = action.payload.subtasks;
            })
            .addCase(fetchAllSubtasks.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch my subtasks
            .addCase(fetchMySubtasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMySubtasks.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.mySubtasks = action.payload.subtasks;
            })
            .addCase(fetchMySubtasks.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch assigned subtasks
            .addCase(fetchAssignedSubtasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAssignedSubtasks.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.assignedSubtasks = action.payload.subtasks;
            })
            .addCase(fetchAssignedSubtasks.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch subtask by ID
            .addCase(fetchSubtaskById.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchSubtaskById.fulfilled, (state, action: PayloadAction<any>) => {
                state.selectedSubtask = action.payload.subtask;
                state.loading = false;
            })
            .addCase(fetchSubtaskById.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.loading = false;
            })

            // Create subtask
            .addCase(createSubtask.pending, (state) => {
                state.loading = true;
            })
            .addCase(createSubtask.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.subtasks.push(action.payload.subtask);
                state.success = action.payload.message;
            })
            .addCase(createSubtask.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update subtask
            .addCase(updateSubtask.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateSubtask.fulfilled, (state, action: PayloadAction<any>) => {
                const index = state.subtasks.findIndex((subtask) => subtask._id === action.payload.updatedSubtask._id);
                if (index !== -1) state.subtasks[index] = action.payload.updatedSubtask;
                state.selectedSubtask = action.payload.updatedSubtask;
                state.success = action.payload.message;
                state.loading = false;
            })
            .addCase(updateSubtask.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update subtask status
            .addCase(updateSubtaskStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateSubtaskStatus.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const index = state.subtasks.findIndex((subtask) => subtask._id === action.payload.subtask._id);
                if (index !== -1) state.subtasks[index] = action.payload.subtask;
                state.success = action.payload.message;
            })
            .addCase(updateSubtaskStatus.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add comment to subtask
            .addCase(addSubtaskComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(addSubtaskComment.fulfilled, (state, action: PayloadAction<any>) => {
                const index = state.subtasks.findIndex((subtask) => subtask._id === action.payload.subtask._id);
                if (index !== -1) state.subtasks[index].comments.push(action.payload.comment);
                state.success = action.payload.message;
                state.loading = false;
            })
            .addCase(addSubtaskComment.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete subtask
            .addCase(deleteSubtask.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteSubtask.fulfilled, (state, action: PayloadAction<any>) => {
                state.subtasks = state.subtasks.filter((subtask) => subtask._id !== action.payload.deleteSubtaskId);
                state.mySubtasks = state.mySubtasks.filter((subtask) => subtask._id !== action.payload.deleteSubtaskId);
                state.assignedSubtasks = state.assignedSubtasks.filter((subtask) => subtask._id !== action.payload.deleteSubtaskId);
                state.success = action.payload.message;
                state.loading = false;
            })
            .addCase(deleteSubtask.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { resetMessages, setError, setAssignedSubtasks, setSelectedSubtask, resetSelectedSubtask } = subtaskSlice.actions;

// Selectors
export const selectAllSubtasks = (state: RootState) => state.subtasks.subtasks;
export const selectMySubtasks = (state: RootState) => state.subtasks.mySubtasks;
export const selectAssignedSubtasks = (state: RootState) => state.subtasks.assignedSubtasks;

export default subtaskSlice.reducer;
