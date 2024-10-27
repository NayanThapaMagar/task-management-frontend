import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import tasksAxios from '../api/tasks';
import { Task } from '../types';

interface TaskState {
    tasks: Task[];
    myTasks: Task[];
    assignedTasks: Task[];
    loading: boolean;
    error: string | null;
    totalTasks: number;
    totalPages: number;
    taskById: Task | null; 
}

// Initial state
const initialState: TaskState = {
    tasks: [],
    myTasks: [],
    assignedTasks: [],
    loading: false,
    error: null,
    totalTasks: 0,
    totalPages: 0,
    taskById: null, 
};

// Async actions
export const fetchAllTasks = createAsyncThunk(
    'tasks/fetchAll',
    async (params: { page: number; limit: number; status?: string; priority?: string }, { rejectWithValue }) => {
        try {
            const { data } = await tasksAxios.get('/', { params });
            
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching tasks');
        }
    }
);

export const fetchMyTasks = createAsyncThunk(
    'tasks/fetchMyTasks',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await tasksAxios.get('/my-tasks');
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching my tasks');
        }
    }
);

export const fetchAssignedTasks = createAsyncThunk(
    'tasks/fetchAssignedTasks',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await tasksAxios.get('/assigned-tasks');
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
            const { data } = await tasksAxios.get(`/${taskId}`);
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
            const { data } = await tasksAxios.post('/', taskData);
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
            const { data } = await tasksAxios.put(`/${taskId}`, updates);
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
            const { data } = await tasksAxios.patch(`/${taskId}/status`, { status });
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
            const { data } = await tasksAxios.post(`/${taskId}/comments`, { text });
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
            await tasksAxios.delete(`/${taskId}`);
            return taskId;
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
        resetError: (state) => {
            state.error = null;
        },
        setMyTasks: (state, action: PayloadAction<Task[]>) => {
            state.myTasks = action.payload;
        },
        setAssignedTasks: (state, action: PayloadAction<Task[]>) => {
            state.assignedTasks = action.payload;
        },
        setTaskById: (state, action: PayloadAction<Task>) => {
            state.taskById = action.payload;
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
                state.totalTasks = action.payload.totalTasks;
                state.totalPages = action.payload.totalPages;
            })
            .addCase(fetchAllTasks.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Fetch task by ID
            .addCase(fetchTaskById.fulfilled, (state, action: PayloadAction<Task>) => {
                state.taskById = action.payload;
            })
            .addCase(fetchTaskById.rejected, (state, action: PayloadAction<any>) => {
                state.error = action.payload;
            })

            // Create task
            .addCase(createTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(createTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.loading = false;
                state.tasks.push(action.payload);
            })
            .addCase(createTask.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update task
            .addCase(updateTask.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTask.fulfilled, (state, action: PayloadAction<Task>) => {
                state.loading = false;
                const index = state.tasks.findIndex((task) => task._id === action.payload._id);
                if (index !== -1) state.tasks[index] = action.payload;
            })
            .addCase(updateTask.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Update task status
            .addCase(updateTaskStatus.pending, (state) => {
                state.loading = true;
            })
            .addCase(updateTaskStatus.fulfilled, (state, action: PayloadAction<Task>) => {
                state.loading = false;
                const index = state.tasks.findIndex((task) => task._id === action.payload._id);
                if (index !== -1) state.tasks[index] = action.payload;
            })
            .addCase(updateTaskStatus.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })
            // Add comment to task
            .addCase(addTaskComment.fulfilled, (state, action: PayloadAction<Task>) => {
                const index = state.tasks.findIndex((task) => task._id === action.payload._id);
                if (index !== -1) state.tasks[index].comments = action.payload.comments;
            })

            // Delete task
            .addCase(deleteTask.fulfilled, (state, action: PayloadAction<string>) => {
                state.tasks = state.tasks.filter((task) => task._id !== action.payload);
            });
    },
});

// Selector
export const selectTasks = (state: RootState) => state.tasks.tasks;

// Actions and reducer export
export const { resetError, setMyTasks, setAssignedTasks, setTaskById } = taskSlice.actions;
export default taskSlice.reducer;
