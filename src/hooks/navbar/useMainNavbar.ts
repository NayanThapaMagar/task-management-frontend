import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice";
import { addNewNotification, selectUnSeenNotifications, fetchUnSeenNotificationsCount } from "../../features/notificationSlice";
import { AppDispatch } from "../../store";
import { getSocket } from '../../socktes/socket';
import { DefaultEventsMap } from "@socket.io/component-emitter";
import { Socket } from "socket.io-client";

const useMainNavbar = () => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    // const { loading, error, success } = useSelector((state: RootState) => state.notifications);

    const unSeenNotificationsCount = useSelector(selectUnSeenNotifications)

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

    const setUnSeenNotificationsCount = async () => {
        await dispatch(fetchUnSeenNotificationsCount());
    };

    let socket: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    useEffect(() => {
        const initializeAndListenSocket = async () => {
            await setUnSeenNotificationsCount();
            socket = getSocket();

            if (socket) {
                socket.on('newNotification', (newNotification) => {
                    dispatch(addNewNotification(newNotification));
                });
            } else {
                // console.warn('Socket is not initialized yet.');
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