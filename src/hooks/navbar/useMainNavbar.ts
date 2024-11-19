import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice";
import { fetchAllNotifications, markAllNotificationsAsSeen, selectAllNotifications, addNewNotification } from "../../features/notificationSlice";
import { AppDispatch } from "../../store";
import { getSocket } from '../../socktes/socket';

const useMainNavbar = () => {

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const allNotifications = useSelector(selectAllNotifications)
    const unSeenNotifications = allNotifications.filter((notificaiton) => notificaiton.isSeen === false)
    const unSeenNotificationsCount = unSeenNotifications.length;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

    const fetchNotifications = async () => {
        const fetchSuccess = await dispatch(fetchAllNotifications({ page: 1, limit: 10 }));

        if (fetchSuccess) {
            const socket = getSocket();
            if (socket) {
                socket.on('newNotification', (newNotification) => {
                    dispatch(addNewNotification(newNotification))
                });
            } else {
                console.warn('Socket is not initialized yet.');
            }
        }
    };

    useEffect(() => {
        // Fetch allNotifications only once when the component mounts
        fetchNotifications();

        // // Clean up the socket listener when the component unmounts
        // return () => {
        //     const socket = getSocket();
        //     if (socket) {
        //         socket.off('newNotification');  // Remove listener to prevent memory leaks
        //     }
        // };
    }, [dispatch]);


    const toggleNotification = async (event: React.MouseEvent<HTMLElement>) => {
        if (notificationAnchorEl) {
            setNotificationAnchorEl(null);
        } else {
            setNotificationAnchorEl(event.currentTarget);
            await dispatch(markAllNotificationsAsSeen({ page: 1, limit: 10 }));
        }
    };

    const handleNotificationBarClose = () => {
        setNotificationAnchorEl(null);
    };


    const handleAccountMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleAccountMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout()).then(() => navigate('/login'));
    };

    // Function to handle navigation and close drawer
    const handleNavigation = (path: string) => {
        navigate(path);
        setDrawerOpen(false);
    };

    return {
        anchorEl,
        drawerOpen,
        setDrawerOpen,
        notificationAnchorEl,
        unSeenNotificationsCount,
        allNotifications,
        toggleNotification,
        handleNotificationBarClose,
        handleAccountMenuOpen,
        handleAccountMenuClose,
        navigate,
        handleNavigation,
        handleLogout,
    }
}

export default useMainNavbar;