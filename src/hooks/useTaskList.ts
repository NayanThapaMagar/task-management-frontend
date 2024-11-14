import React, { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Task as TaskType } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllTasks, selectMyTasks, selectAssignedTasks, fetchAllTasks, fetchMyTasks, fetchAssignedTasks, updateTaskStatus, setSelectedTask, resetMessages } from '../features/taskSlice';
import { AppDispatch, RootState } from '../store';

const useTaskList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, success } = useSelector((state: RootState) => state.tasks);

    const allTasks = useSelector(selectAllTasks);
    const myTasks = useSelector(selectMyTasks);
    const assignedTasks = useSelector(selectAssignedTasks);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [taskCategory, setTaskCategory] = useState('all');

    const [listTasks, setListTasks] = useState<TaskType[]>([]);

    const [draggedTask, setDraggedTask] = useState<{ task: TaskType; currentStatus: string } | null>(null);

    const fetchData = async () => {
        const query: Record<string, string> = {};
        if (priorityFilter !== 'all') query.priority = priorityFilter;

        if (taskCategory === 'all') {
            await dispatch(fetchAllTasks({ ...query, page: 1, limit: 10 }));
        } else if (taskCategory === 'myTasks') {
            await dispatch(fetchMyTasks({ ...query, page: 1, limit: 10 }));
        } else if (taskCategory === 'assignedTasks') {
            await dispatch(fetchAssignedTasks({ ...query, page: 1, limit: 10 }));
        }
    };

    useEffect(() => {
        fetchData();
    }, [priorityFilter, taskCategory, dispatch]);

    useEffect(() => {
        const tasks = taskCategory === 'all' ? allTasks : taskCategory === 'myTasks' ? myTasks : assignedTasks;
        const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));
        setListTasks(filteredTasks);
    }, [allTasks, myTasks, assignedTasks, search, taskCategory]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handlePriorityFilterChange = (e: SelectChangeEvent<string>) => {
        setPriorityFilter(e.target.value);
    };

    const handleTaskCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskCategory(e.target.value);
    };

    const handleTaskClick = (task: TaskType) => {
        dispatch(setSelectedTask(task))
        navigate('/tasks/taskDetail');
    };

    const handleDragStart = (e: React.DragEvent<HTMLElement>, task: TaskType, currentStatus: string) => {
        e.dataTransfer.effectAllowed = "move";
        setDraggedTask({ task, currentStatus });
    };

    const handleDragOver = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = async (e: React.DragEvent<HTMLElement>, newStatus: string) => {
        e.preventDefault();
        if (draggedTask && draggedTask.currentStatus !== newStatus) {
            await dispatch(updateTaskStatus({ taskId: draggedTask.task._id, status: newStatus.toLocaleLowerCase() }))
        }
        setDraggedTask(null);
    };

    useEffect(() => {
        if (error || success) {
            setOpenSnackbar(true);
        }
    }, [error, success]);

    const handleSnackbarClose = () => {
        dispatch(resetMessages());
        setOpenSnackbar(false);
    };

    const groupedTasks = {
        'To Do': listTasks.filter((task) => task.status === 'to do'),
        'Pending': listTasks.filter((task) => task.status === 'pending'),
        'Completed': listTasks.filter((task) => task.status === 'completed'),
    };

    return {
        groupedTasks,
        handleTaskClick,
        priorityFilter,
        handlePriorityFilterChange,
        taskCategory,
        handleTaskCategoryChange,
        search,
        handleSearchChange,
        handleDragStart,
        handleDragOver,
        handleDrop,
        loading,
        success,
        error,
        openSnackbar,
        handleSnackbarClose,
    };
}

export default useTaskList;