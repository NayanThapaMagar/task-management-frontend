import { Box } from "@mui/material";
import NotificationBar from "../components/Notification/NotificationBar";
import useNotificaion from "../hooks/notification/useNotification";
import { useAppState } from "../context/AppStateContext";

const Notification: React.FC = () => {

    const {
        isNotificationsPageMode,
    } = useAppState();

    useNotificaion();

    return (
        <Box display="flex" justifyContent="center" alignItems="center"
            sx={{
                overflow: 'hidden',
                maxHeight: 'calc(100vh - 70px)',
                maxWidth: 'calc(100vw - 57px)',
            }}
        >
            <NotificationBar
                pageMode={isNotificationsPageMode}
                minWidth="100%"
                maxWidth="inherit"
            />
        </Box>
    );
};

export default Notification;
