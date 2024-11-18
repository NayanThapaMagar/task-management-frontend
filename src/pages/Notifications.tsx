import { Box } from "@mui/material";
import NotificationBar from "../components/Notification/NotificationBar";
import useMainNavbar from "../hooks/navbar/useMainNavbar";

const Notification: React.FC = () => {
    const {
        handleNotificationBarClose,
    } = useMainNavbar();

    return (
        <Box display="flex" justifyContent="center" alignItems="center" >
            <NotificationBar minWidth="100%" onClose={handleNotificationBarClose} />
        </Box>
    );
}

export default Notification