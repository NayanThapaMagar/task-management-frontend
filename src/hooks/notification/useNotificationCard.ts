import { useState } from "react";


const useNotificationCard = () => {

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

    const handleMoreClick = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setAnchorEl(null);
    };

    return {
        anchorEl,
        handleMoreClick,
        handleMenuClose,
    }
}

export default useNotificationCard;