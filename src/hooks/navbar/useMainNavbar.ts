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

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();

    const { loading, error, success } = useSelector((state: RootState) => state.notifications);

    const allNotifications = useSelector(selectAllNotifications)
    const unSeenNotifications = allNotifications.filter((notificaiton) => notificaiton.isSeen === false)
    const unSeenNotificationsCount = unSeenNotifications.length;

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

    const [page, setPage] = useState(1);

    const fetchNotifications = async () => {
        await dispatch(fetchAllNotifications({ page, limit: 20 }));
    };

    const fetchMoreNotifications = async () => {
        setPage((prev) => prev + 1);
        await fetchNotifications();
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

    const handleScroll = async (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const scrollContainer = e.currentTarget;

        console.log('scrolling...');
        
        if (!loading && scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
            console.log(`On page ${page} fetching more notifications....`);
            await fetchMoreNotifications();
        }
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
        handleScroll,
        navigate,
        handleNavigation,
        handleLogout,
    }
}

export default useMainNavbar;