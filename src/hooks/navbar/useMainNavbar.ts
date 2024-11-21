import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice";
import { fetchAllNotifications, markAllNotificationsAsSeen, selectAllNotifications, addNewNotification } from "../../features/notificationSlice";
import { AppDispatch, RootState } from "../../store";
import { getSocket } from '../../socktes/socket';
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";

const useMainNavbar = () => {

    const dispatch  = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // const { loading, error, success } = useSelector((state: RootState) => state.notifications);

    const allNotifications = useSelector(selectAllNotifications)
    const unSeenNotifications = allNotifications.filter((notificaiton) => notificaiton.isSeen === false)
    const unSeenNotificationsCount = unSeenNotifications.length;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

    const fetchNotifications = async () => {
        await dispatch(fetchAllNotifications({ page: 1, limit: 50 }));
    };

    let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    useEffect(() => {
        const initializeAndListenSocket = async () => {
            await fetchNotifications();
            socket = getSocket();

            if (socket) {
                socket.on('newNotification', (newNotification) => {
                    dispatch(addNewNotification(newNotification));
                });
            } else {
                console.warn('Socket is not initialized yet.');
            }
        };

        initializeAndListenSocket();

        // Clean up socket listener when the component unmounts
        return () => {
            if (socket) {
                socket.off('newNotification'); // Remove listener to prevent memory leaks
            }
        };
    }, [dispatch]);



    const toggleNotification = async (event: React.MouseEvent<HTMLElement>) => {
        if (notificationAnchorEl) {
            setNotificationAnchorEl(null);
        } else {
            setNotificationAnchorEl(event.currentTarget);
            // fetchNotifications();
            await dispatch(markAllNotificationsAsSeen({ page: 1, limit: 20 }));
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

    // Function to handle navigation and close drawer
    const handleNavigation = (path: string) => {
        navigate(path);
        setDrawerOpen(false);
    };

    const handleLogout = () => {
        dispatch(logout()).then(() => navigate('/login'));
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