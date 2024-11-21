import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store";
import { Notification, SubTask, Task } from "../../types";
import { fetchAllNotifications, markAllNotificationsAsRead, markNotificationAsRead, markNotificationAsUnread, deleteNotification, selectAllNotifications, selectUnReadNotifications, resetNotifications, resetUnReadNotifications } from "../../features/notificationSlice";
import { setSelectedTask } from "../../features/taskSlice";
import { setSelectedSubtask } from "../../features/subtaskSlice";
import { useNavigate } from "react-router-dom";

const useNotificationBar = (notifications: Notification[], closeNotificationBar: () => void) => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate();

    const { loading, error, success, hasMoreNotifications, hasMoreUnreadNotifications } = useSelector((state: RootState) => state.notifications);

    const allNotifications = useSelector(selectAllNotifications)
    const unReadNotifications = useSelector(selectUnReadNotifications)
    const [showUnread, setShowUnread] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const [notificationsPage, setNotificationsPage] = useState(1);
    const [unReadNotificationsPage, setUnReadNotificationsPage] = useState(1);


    const fetchNotificationsAtMount = async () => {
        await dispatch(fetchAllNotifications({ isRead: false, page: 1, limit: 20 }));
        await dispatch(fetchAllNotifications({ page: 1, limit: 20 }));
    }
    const fetchNotifications = async () => {
        if (showUnread && hasMoreUnreadNotifications) {
            console.log(`Fetching ${unReadNotificationsPage > 1 ? 'more' : ''} unread notifications at page ${unReadNotificationsPage}`);
            await dispatch(fetchAllNotifications({ isRead: false, page: unReadNotificationsPage, limit: 20 }));
            console.log("hasMoreUnreadNotifications:", hasMoreUnreadNotifications);
        } else if (!showUnread && hasMoreNotifications) {
            console.log(`Fetching ${notificationsPage > 1 ? 'more' : ''} notifications at page ${notificationsPage}`);
            await dispatch(fetchAllNotifications({ page: notificationsPage, limit: 20 }));
            console.log("hasMoreNotifications:", hasMoreNotifications);
        }
    };

    useEffect(() => {
        dispatch(resetNotifications())
        dispatch(resetUnReadNotifications())
        fetchNotificationsAtMount()
        return () => {
            console.log('unmount');
            dispatch(resetNotifications())
            dispatch(resetUnReadNotifications())
        }
    }, []);

    useEffect(() => {
        // fetching more NOTIFICATIOINS if any
        if (notificationsPage > 1 || unReadNotificationsPage > 1) {
            fetchNotifications();
        }
    }, [notificationsPage, unReadNotificationsPage]);

    const filteredNotifications = showUnread ? unReadNotifications : allNotifications;
    // ? notifications.filter((notification) => !notification.isRead)

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

    const handleScroll = async (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const scrollContainer = e.currentTarget;

        console.log('scrolling at bottom....', scrollContainer.scrollTop + scrollContainer.clientHeight + 1 >= scrollContainer.scrollHeight);
        // // // console.log("scrollTop:", scrollContainer.scrollTop);
        // // // console.log("clientHeight:", scrollContainer.clientHeight);
        // // // console.log("scrollHeight:", scrollContainer.scrollHeight);
        // // console.log("hasMoreNotifications:", hasMoreNotifications);

        // console.log({ hasMoreNotifications });
        // console.log({ hasMoreUnreadNotifications });


        if (!loading && !showUnread && hasMoreNotifications && (scrollContainer.scrollTop + scrollContainer.clientHeight + 1 >= scrollContainer.scrollHeight)) {
            setNotificationsPage((prev) => prev + 1);
        }
        if (!loading && showUnread && hasMoreUnreadNotifications && (scrollContainer.scrollTop + scrollContainer.clientHeight + 1 >= scrollContainer.scrollHeight)) {
            setUnReadNotificationsPage((prev) => prev + 1);
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
        handleScroll,
        handleMenuClose,
        navigate,
    }
}

export default useNotificationBar;


