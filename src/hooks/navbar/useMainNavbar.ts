import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { logout } from "../../features/authSlice";
import { AppDispatch } from "../../store";

const useMainNavbar = () => {

    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [notificationAnchorEl, setNotificationAnchorEl] = useState<null | HTMLElement>(null);

    const toggleNotification = (event: React.MouseEvent<HTMLElement>) => {
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