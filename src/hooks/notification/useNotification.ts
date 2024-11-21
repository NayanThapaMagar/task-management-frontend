import { useEffect } from "react";
import { useAppState } from "../../context/AppStateContext";
import { resetNotifications } from "../../features/notificationSlice";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";

const useNotificaion = () => {
    const dispatch = useDispatch<AppDispatch>()

    const {
        setIsNotificationsPageMode
    } = useAppState();

    useEffect(() => {
        setIsNotificationsPageMode(true);
        return () => {
            setIsNotificationsPageMode(false);
            dispatch(resetNotifications())
        };
    }, [setIsNotificationsPageMode]);

    return {

    };
};

export default useNotificaion;
