import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/authSlice';
import userConnectionReducer from '../features/userConnectionSlice';
import taskReducer from '../features/taskSlice';

export const store = configureStore({
    reducer: {
        auth: authReducer,
        tasks: taskReducer,
        userConnection: userConnectionReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
