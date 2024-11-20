import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Notification, SubTask, Task } from "../../types";
import { fetchAllNotifications, markAllNotificationsAsRead, markNotificationAsRead, markNotificationAsUnread, deleteNotification } from "../../features/notificationSlice";
import { setSelectedTask } from "../../features/taskSlice";
import { setSelectedSubtask } from "../../features/subtaskSlice";
import { useNavigate } from "react-router-dom";

const useNotificationBar = (notifications: Notification[], closeNotificationBar: () => void) => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();

    // const { loading, error, success } = useSelector((state: RootState) => state.notifications);

    const [showUnread, setShowUnread] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);


    const filteredNotifications = showUnread
        ? notifications.filter((notification) => !notification.isRead)
        : notifications;

    const markAsRead = async (notificationId: string) => {
        await dispatch(markNotificationAsRead(notificationId))
    };
    const markAsUnread = async (notificationId: string) => {
        await dispatch(markNotificationAsUnread(notificationId))
    };
    const markAllAsRead = async () => {
        handleMenuClose()
        await dispatch(markAllNotificationsAsRead({ page: 1, limit: 20 }))
    };
    const handleDeleteNotification = async (notificationId: string) => {
        await dispatch(deleteNotification(notificationId))
    };
    const handleNotificationClick = async (notification: Notification) => {
        closeNotificationBar()
        if (notification.taskId && !notification.subtaskId) {
            await dispatch(markNotificationAsRead(notification._id))
            dispatch(setSelectedTask(notification.taskId as Task))
            navigate('/tasks/taskDetail')
        } else if (notification.subtaskId && !notification.taskId) {
            await dispatch(markNotificationAsRead(notification._id))
            dispatch(setSelectedSubtask(notification.subtaskId as SubTask))
            navigate('/tasks/subtaskDetail');
        }
    };

    const toggleMenu = (e: React.MouseEvent<HTMLElement>) => {
        if (Boolean(anchorEl)) {
            setAnchorEl(null);
        } else {
            setAnchorEl(e.currentTarget);
        }
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    return {
        anchorEl,
        showUnread,
        setShowUnread,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        handleDeleteNotification,
        handleNotificationClick,
        filteredNotifications,
        toggleMenu,
        handleMenuClose,
        navigate,
    }
}

export default useNotificationBar;


