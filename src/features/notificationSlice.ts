import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import axiosInstance from '../api/axios';
import { Notification } from '../types';

const BASE_URL = '/notifications';

interface NotificationState {
    notifications: Notification[];
    unReadNotifications: Notification[];
    loading: boolean;
    error: string | null;
    success: string | null;
    unSeenNotifications: number;
    totalNotifications: number;
    totalPages: number;
    hasMoreNotifications: boolean;
    hasMoreUnreadNotifications: boolean;
}

// Initial state
const initialState: NotificationState = {
    notifications: [],
    unReadNotifications: [],
    loading: false,
    error: null,
    success: null,
    unSeenNotifications: 0,
    totalNotifications: 0,
    totalPages: 0,
    hasMoreNotifications: true,
    hasMoreUnreadNotifications: true,
};

// Async actions
let isRead: boolean | undefined;
// Fetch all notifications
export const fetchAllNotifications = createAsyncThunk(
    'notifications/fetchAll',
    async (params: { isRead?: boolean; page: number; limit: number }, { rejectWithValue }) => {
        try {
            isRead = params.isRead;
            const { data } = await axiosInstance.get(`${BASE_URL}`, { params });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching notifications');
        }
    }
);
// Fetch unseen notifications count
export const fetchUnSeenNotificationsCount = createAsyncThunk(
    'notifications/fetchUnSeenNotificationsCount',
    async (_, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.get(`${BASE_URL}/unseen`);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching unseen notifications count');
        }
    }
);

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
    'notifications/markAsRead',
    async (notificationId: string, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`${BASE_URL}/${notificationId}/read`);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error marking notification as read');
        }
    }
);

// Mark notification as unread
export const markNotificationAsUnread = createAsyncThunk(
    'notifications/markAsUnread',
    async (notificationId: string, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.patch(`${BASE_URL}/${notificationId}/unread`);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error marking notification as unread');
        }
    }
);

// Mark all notifications as read
export const markAllNotificationsAsRead = createAsyncThunk(
    'notifications/markAllAsRead',
    async (params: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.put(`${BASE_URL}/markAllRead`, { params });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error marking all notifications as read');
        }
    }
);

// Mark all notifications as read
export const markAllNotificationsAsSeen = createAsyncThunk(
    'notifications/markAllAsSeen',
    async (params: { page: number; limit: number }, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.put(`${BASE_URL}/markAllSeen`, { params });
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error marking all notifications as seen');
        }
    }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
    'notifications/delete',
    async (notificationId: string, { rejectWithValue }) => {
        try {
            const { data } = await axiosInstance.delete(`${BASE_URL}/${notificationId}`);
            return data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error deleting notification');
        }
    }
);

// Notification slice
const notificationSlice = createSlice({
    name: 'notifications',
    initialState,
    reducers: {
        resetMessages(state) {
            state.error = null;
            state.success = null;
        },
        addNewNotification: (state, action: PayloadAction<Notification>) => {
            state.notifications = [action.payload, ...state.notifications];
            state.unSeenNotifications = state.unSeenNotifications + 1 
        },
        resetNotifications: (state) => {
            state.notifications = [];
        },
        resetUnReadNotifications: (state) => {
            state.unReadNotifications = [];
        },
    },
    extraReducers: (builder) => {
        builder
            // Fetch all notifications
            .addCase(fetchAllNotifications.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchAllNotifications.fulfilled, (state, action: PayloadAction<any>) => {
                if (isRead === undefined) {
                    if (action.payload.notifications.length > 0) {
                        state.hasMoreNotifications = true
                        state.notifications = [...state.notifications, ...action.payload.notifications];
                    } else {
                        state.hasMoreNotifications = false
                    }
                    state.loading = false;
                } else if (isRead === false) {
                    if (action.payload.notifications.length > 0) {
                        state.hasMoreUnreadNotifications = true
                        state.unReadNotifications = [...state.unReadNotifications, ...action.payload.notifications];
                    } else {
                        state.hasMoreUnreadNotifications = false
                    }
                    state.loading = false;
                }
                // state.totalNotifications = action.payload.totalNotifications;
                // state.totalPages = action.payload.totalPages;
                // state.notifications = action.payload.notifications;
            })
            .addCase(fetchAllNotifications.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // fetch unseen notifications count
            .addCase(fetchUnSeenNotificationsCount.pending, (state) => {
                state.loading = true;
            })
            .addCase(fetchUnSeenNotificationsCount.fulfilled, (state, action: PayloadAction<any>) => {
                state.unSeenNotifications = action.payload.count;
                state.loading = false;
            })
            .addCase(fetchUnSeenNotificationsCount.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Mark notification as read
            .addCase(markNotificationAsRead.pending, (state) => {
                state.loading = true;
            })
            .addCase(markNotificationAsRead.fulfilled, (state, action: PayloadAction<any>) => {
                const indexOfAllNotifications = state.notifications.findIndex((notification) => notification._id === action.payload.updatedNotification._id);
                if (indexOfAllNotifications !== -1) state.notifications[indexOfAllNotifications] = action.payload.updatedNotification;
                const indexOfUnReadNotifications = state.unReadNotifications.findIndex((notification) => notification._id === action.payload.updatedNotification._id);
                if (indexOfUnReadNotifications !== -1) state.unReadNotifications[indexOfUnReadNotifications] = action.payload.updatedNotification;
                state.success = action.payload.message;
                state.loading = false;
            })
            .addCase(markNotificationAsRead.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Mark notification as unread
            .addCase(markNotificationAsUnread.pending, (state) => {
                state.loading = true;
            })
            .addCase(markNotificationAsUnread.fulfilled, (state, action: PayloadAction<any>) => {
                const indexOfAllNotifications = state.notifications.findIndex((notification) => notification._id === action.payload.updatedNotification._id);
                if (indexOfAllNotifications !== -1) state.notifications[indexOfAllNotifications] = action.payload.updatedNotification;
                const indexOfUnReadNotifications = state.unReadNotifications.findIndex((notification) => notification._id === action.payload.updatedNotification._id);
                if (indexOfUnReadNotifications !== -1) state.unReadNotifications[indexOfUnReadNotifications] = action.payload.updatedNotification;
                state.success = action.payload.message;
                state.loading = false;
            })
            .addCase(markNotificationAsUnread.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Mark all notifications as read
            .addCase(markAllNotificationsAsRead.pending, (state) => {
                state.loading = true;
            })
            .addCase(markAllNotificationsAsRead.fulfilled, (state, action: PayloadAction<any>) => {
                state.notifications = action.payload.updatedNotifications;
                state.unReadNotifications = [];
                state.success = action.payload.message;
                state.loading = false;
            })
            .addCase(markAllNotificationsAsRead.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Mark all notifications as seen
            .addCase(markAllNotificationsAsSeen.pending, (state) => {
                state.loading = true;
            })
            .addCase(markAllNotificationsAsSeen.fulfilled, (state, action: PayloadAction<any>) => {
                // state.notifications = action.payload.updatedNotifications;
                // state.success = action.payload.message;
                state.unSeenNotifications = 0
                state.loading = false;
            })
            .addCase(markAllNotificationsAsSeen.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            })

            // Delete notification
            .addCase(deleteNotification.pending, (state) => {
                state.loading = true;
            })
            .addCase(deleteNotification.fulfilled, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.notifications = state.notifications.filter(
                    (notification) => notification._id !== action.payload.deletedNotificationId
                );
                state.success = action.payload.message;
            })
            .addCase(deleteNotification.rejected, (state, action: PayloadAction<any>) => {
                state.loading = false;
                state.error = action.payload;
            });
    },
});

export const { addNewNotification, resetNotifications, resetUnReadNotifications, resetMessages } = notificationSlice.actions;

export const selectAllNotifications = (state: RootState) => state.notifications.notifications;
export const selectUnReadNotifications = (state: RootState) => state.notifications.unReadNotifications;
export const selectUnSeenNotifications = (state: RootState) => state.notifications.unSeenNotifications;

export default notificationSlice.reducer;
