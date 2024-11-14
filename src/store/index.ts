import { configureStore } from '@reduxjs/toolkit';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import authReducer from '../features/authSlice';
import userConnectionReducer from '../features/userConnectionSlice';
import taskReducer from '../features/taskSlice';
import subtaskReducer from '../features/subtaskSlice';

// Define the persist configuration
const taskPersistConfig = {
    key: 'tasks',
    storage,
    whitelist: ['selectedTask'],
};
const subtaskPersistConfig = {
    key: 'subtasks',
    storage,
    whitelist: ['selectedSubtask'],
};

// Wrap taskReducer with persistReducer to persist only selectedTask
const persistedTaskReducer = persistReducer(taskPersistConfig, taskReducer);
const persistedsubTaskReducer = persistReducer(subtaskPersistConfig, subtaskReducer);

export const store = configureStore({
    reducer: {
        auth: authReducer,
        userConnection: userConnectionReducer,
        tasks: persistedTaskReducer,
        subtasks: persistedsubTaskReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false, // Disables serializable check for redux-persist compatibility
        }),
});

// Set up persistor for use with PersistGate in the main app file
export const persistor = persistStore(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
