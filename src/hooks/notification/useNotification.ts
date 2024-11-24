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
};

export default useNotificaion;
