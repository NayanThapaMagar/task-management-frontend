import { Box } from "@mui/material";
import NotificationBar from "../components/Notification/NotificationBar";
import useMainNavbar from "../hooks/navbar/useMainNavbar";
import useNotificaion from "../hooks/notification/useNotification";
import { useAppState } from "../context/AppStateContext";

const Notification: React.FC = () => {

    const {
        isNotificationsPageMode
    } = useAppState();
    const {
        allNotifications,
        handleNotificationBarClose,
    } = useMainNavbar();

    useNotificaion();

    return (
        <Box display="flex" justifyContent="center" alignItems="center"
            sx={{
                overflow: 'hidden',
                maxHeight: 'calc(100vh - 66px)',
                maxWidth: 'calc(100vw - 57px)',
            }}
        >
            <NotificationBar
                notifications={allNotifications}
                pageMode={isNotificationsPageMode}
                minWidth="100%"
                onClose={handleNotificationBarClose}
            />
        </Box>
    );
};

export default Notification;
