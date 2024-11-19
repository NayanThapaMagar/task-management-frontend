import { useEffect } from "react";
import { useAppState } from "../../context/AppStateContext";

const useNotificaion = () => {

    const {
        setIsNotificationsPageMode
    } = useAppState();

    useEffect(() => {
        setIsNotificationsPageMode(true);
        return () => {
            setIsNotificationsPageMode(false);
        };
    }, [setIsNotificationsPageMode]);

    return {

    };
};

export default useNotificaion;
