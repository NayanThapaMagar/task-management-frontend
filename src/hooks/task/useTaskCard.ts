import React from 'react';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../../features/taskSlice';
import { AppDispatch } from '../../store';
import { Task } from '../../types';
import { getPriorityColor } from '../../styles/theme';

const useTaskCard = () => {

    const dispatch = useDispatch<AppDispatch>();

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [currentTaskOnMenu, setCurrentTaskOnMenu] = React.useState<Task | null>(null);

    const handleTaskMenuClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleTaskMenuClose = (event: React.MouseEvent<HTMLElement>) => {
        event.stopPropagation();
        setCurrentTaskOnMenu(null)
        setAnchorEl(null);
    };

    const handleDeleteTask = async () => {
        const taskId = currentTaskOnMenu?._id
        if (taskId) {
            await dispatch(deleteTask(taskId));
            setCurrentTaskOnMenu(null)
        }
    }

    return {
        getPriorityColor,
        handleTaskMenuClose,
        handleTaskMenuClick,
        setCurrentTaskOnMenu,
        anchorEl,
        handleDeleteTask,
    };
}

export default useTaskCard;