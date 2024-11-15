import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteSubtask } from '../../features/subtaskSlice';
import { AppDispatch } from '../../store';
import { SubTask } from '../../types';
import { getPriorityColor } from '../../styles/theme';

const useSubtaskCard = () => {
 
    const dispatch = useDispatch<AppDispatch>();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [currentSubtaskOnMenu, setCurrentSubtaskOnMenu] = React.useState<SubTask | null>(null);

    const handleSubtaskMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleSubtaskMenuClose = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setCurrentSubtaskOnMenu(null)
        setAnchorEl(null);
    };

    const handleDeleteSubtask = async (taskId: string) => {
        const subtaskId = currentSubtaskOnMenu?._id
        if (taskId && subtaskId) {
            await dispatch(deleteSubtask({ taskId, subtaskId }));
            setCurrentSubtaskOnMenu(null)
        }
    }

    return {
        getPriorityColor,
        handleSubtaskMenuClose,
        handleSubtaskMenuClick,
        setCurrentSubtaskOnMenu,
        anchorEl,
        handleDeleteSubtask,
    };
}

export default useSubtaskCard;