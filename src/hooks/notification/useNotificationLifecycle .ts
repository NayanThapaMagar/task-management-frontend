import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { useEffect } from "react";
import { fetchAllNotifications, markAllNotificationsAsSeen, resetNotifications, resetUnReadNotifications } from "../../features/notificationSlice";

const useNotificationLifecycle = () => {
    const dispatch = useDispatch<AppDispatch>();

    const fetchNotificationsAtMountAndMarkAsSeen = async () => {
        await dispatch(markAllNotificationsAsSeen({ page: 1, limit: 20 }));
        await dispatch(fetchAllNotifications({ isRead: false, page: 1, limit: 20 }));
        await dispatch(fetchAllNotifications({ page: 1, limit: 20 }));
    }

    useEffect(() => {
        // Initial fetch
        dispatch(resetNotifications());
        dispatch(resetUnReadNotifications());
        fetchNotificationsAtMountAndMarkAsSeen()
        return () => {
            dispatch(resetNotifications());
            dispatch(resetUnReadNotifications());
        };
    }, [dispatch]);
};

export default useNotificationLifecycle;