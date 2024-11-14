import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axiosInstance from '../api/axios';
import { Task } from '../types';

const BASE_URL = '/tasks';

interface TaskState {
    tasks: Task[];
    myTasks: Task[];
    assignedTasks: Task[];
    loading: boolean;
    error: string | null;
    success: string | null;
    totalTasks: number;
    totalPages: number;
    selectedTask: Task | null;
}

// Initial state
const initialState: TaskState = {
    tasks: [],
    myTasks: [],
    assignedTasks: [],
    loading: false,
    error: null,
    success: null,
    totalTasks: 0,
    totalPages: 0,
    selectedTask: null,
};

// Async actions
export const fetchAllTasks = createAsyncThunk(
    'tasks/fetchAll',
    async (params: { page: number; limit: number; status?: string; priority?: string }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`${BASE_URL}`, { params });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching tasks');
        }
    }
);

export const fetchMyTasks = createAsyncThunk(
    'tasks/fetchMyTasks',
    async (params: { page: number; limit: number; status?: string; priority?: string }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`${BASE_URL}/my-tasks`, { params });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching my tasks');
        }
    }
);

export const fetchAssignedTasks = createAsyncThunk(
    'tasks/fetchAssignedTasks',
    async (params: { page: number; limit: number; status?: string; priority?: string }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`${BASE_URL}/assigned-tasks`, { params });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching assigned tasks');
        }
    }
);

// New action for fetching a task by ID
export const fetchTaskById = createAsyncThunk(
    'tasks/fetchById',
    async (taskId: string, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`${BASE_URL}/${taskId}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching task');
        }
    }
);

export const createTask = createAsyncThunk(
    'tasks/create',
    async (taskData: { title: string; description: string; priority: string; assignedTo: string[] }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`${BASE_URL}`, taskData);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error creating task');
        }
    }
);

export const updateTask = createAsyncThunk(
    'tasks/update',
    async ({ taskId, updates }: { taskId: string; updates: { title?: string; description?: string; priority?: string; assignedTo?: string[] } }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.put(`${BASE_URL}/${taskId}`, updates);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error updating task');
        }
    }
);

// Update Task Status /:taskId/status
export const updateTaskStatus = createAsyncThunk(
    'tasks/updateStatus',
    async ({ taskId, status }: { taskId: string; status: string }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`${BASE_URL}/${taskId}/status`, { status });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error updating task status');
        }
    }
);

// Add Comment to Task /:taskId/comments
export const addTaskComment = createAsyncThunk(
    'tasks/addComment',
    async ({ taskId, text }: { taskId: string; text: string }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.post(`${BASE_URL}/${taskId}/comments`, { text });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error adding comment');
        }
    }
);

export const deleteTask = createAsyncThunk(
    'tasks/delete',
    async (taskId: string, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete(`${BASE_URL}/${taskId}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error deleting task');
        }
    }
);

// Task slice
const taskSlice = createSlice({
    name: 'tasks',
    initialState,
    reducers: {
        resetMessages(state) {
            state.error = null;
            state.success = null;
        },
        setError(state, action: PayloadAction<string>) {
            state.error = action.payload;
        },
        setMyTasks: (state, action: PayloadAction<Task[]>) => {
            state.myTasks = action.payload;
        },
        setAssignedTasks: (state, action: PayloadAction<Task[]>) => {
            state.assignedTasks = action.payload;
        },
        setSelectedTask: (state, action: PayloadAction<Task>) => {
            state.selectedTask = action.payload;
        },
        resetSelectedTask: (state) => {
            state.selectedTask = null;
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all tasks
            .addCase(fetchAllTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllTasks.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.tasks = action.payload.tasks;
                // state.totalTasks = action.payload.totalTasks;
                // state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchAllTasks.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch my tasks
            .addCase(fetchMyTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchMyTasks.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.myTasks = action.payload.tasks;
                // state.totalTasks = action.payload.totalTasks;
                // state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchMyTasks.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch assigned tasks
            .addCase(fetchAssignedTasks.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAssignedTasks.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.assignedTasks = action.payload.tasks;
                // state.totalTasks = action.payload.totalTasks;
                // state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchAssignedTasks.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch task by ID
            .addCase(fetchTaskById.pending, (state) => {
                state.loading = true;
            })
            // Fetch task by ID
            .addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<any>) => {
                state.selectedTask = action.payload.task;
                state.loading = false;
            })
            .addCase(fetchTaskById.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload;
                state.loading = false;
            })

            // Create task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTask.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.tasks.push(action.payload.task);
                state.success = action.payload.message;
            })
            .addCase(createTask.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTask.fulfilled, (state, action: PayloadAction<any>) => {
                const index = state.tasks.findIndex((task) => task._id === action.payload.updatedTask._id);
                if (index !== -1) state.tasks[index] = action.payload.updatedTask;
                state.selectedTask = action.payload.updatedTask;
                state.success = action.payload.message;
                state.loading = false;
            })
            .addCase(updateTask.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update task status
            .addCase(updateTaskStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTaskStatus.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                const index = state.tasks.findIndex((task) => task._id === action.payload.task._id);
                if (index !== -1) state.tasks[index] = action.payload.task;
                state.success = action.payload.message;
            })
            .addCase(updateTaskStatus.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Add comment to task
            .addCase(addTaskComment.pending, (state) => {
                state.loading = true;
            })
            .addCase(addTaskComment.fulfilled, (state, action: PayloadAction<any>) => {
                const index = state.tasks.findIndex((task) => task._id === action.payload.task._id);
                if (index !== -1) state.tasks[index].comments.push(action.payload.comment);
                state.success = action.payload.message;
                state.loading = false;
            })
            .addCase(addTaskComment.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete task
            .addCase(deleteTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteTask.fulfilled, (state, action: PayloadAction<any>) => {
                state.tasks = state.tasks.filter((task) => task._id !== action.payload.deletedTaskId);
                state.myTasks = state.myTasks.filter((task) => task._id !== action.payload.deletedTaskId);
                state.assignedTasks = state.assignedTasks.filter((task) => task._id !== action.payload.deletedTaskId);
                state.success = action.payload.message;
                state.loading = false;
            })
            .addCase(deleteTask.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

// Selector
export const selectAllTasks = (state: RootState) => state.tasks.tasks;
export const selectMyTasks = (state: RootState) => state.tasks.myTasks;
export const selectAssignedTasks = (state: RootState) => state.tasks.assignedTasks;

// Actions and reducer export
export const { resetMessages, setMyTasks, setAssignedTasks, setSelectedTask, resetSelectedTask, setError } = taskSlice.actions;
export default taskSlice.reducer;
