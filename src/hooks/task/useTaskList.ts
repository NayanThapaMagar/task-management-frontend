import React, { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Task as TaskType } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllTasks, selectMyTasks, selectAssignedTasks, fetchAllTasks, fetchMyTasks, fetchAssignedTasks, updateTaskStatus, resetTasks, setSelectedTask, resetMessages } from '../../features/taskSlice';
import { AppDispatch, RootState } from '../../store';

const useTaskList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, success, hasMoreTasks } = useSelector((state: RootState) => state.tasks);

    const allTasks = useSelector(selectAllTasks);
    const myTasks = useSelector(selectMyTasks);
    const assignedTasks = useSelector(selectAssignedTasks);

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [search, setSearch] = useState('');
    const [taskPriorityFilter, setTaskPriorityFilter] = useState('all');
    const [taskCategory, setTaskCategory] = useState('all');

    const [page, setPage] = useState(1);

    const [listTasks, setListTasks] = useState<TaskType[]>([]);

    const [draggedTask, setDraggedTask] = useState<{ task: TaskType; currentStatus: string } | null>(null);


    const fetchTasks = async () => {
        const query: Record<string, string> = {};
        if (taskPriorityFilter !== 'all') query.priority = taskPriorityFilter;


        console.log(`Fetching ${page !== 1 ? 'more' : ''} tasks at page ${page}`);
        if (taskCategory === 'all') {
            query.status = 'to do';
            await dispatch(fetchAllTasks({ ...query, page, limit: 3 }));
            query.status = 'pending';
            await dispatch(fetchAllTasks({ ...query, page, limit: 3 }));
            query.status = 'completed';
            await dispatch(fetchAllTasks({ ...query, page, limit: 3 }));
        } else if (taskCategory === 'myTasks') {
            await dispatch(fetchMyTasks({ ...query, page, limit: 20 }));
        } else if (taskCategory === 'assignedTasks') {
            await dispatch(fetchAssignedTasks({ ...query, page, limit: 20 }));
        }
    };

    useEffect(() => {
        // fetching more task if any
        if (page > 1) {
            fetchTasks();
        }
    }, [page]);

    useEffect(() => {
        fetchTasks();
        return () => { dispatch(resetTasks()) }
    }, [taskPriorityFilter, taskCategory]);

    useEffect(() => {
        const tasks = taskCategory === 'all' ? allTasks : taskCategory === 'myTasks' ? myTasks : assignedTasks;
        const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));
        setListTasks(filteredTasks);
    }, [allTasks, myTasks, assignedTasks, search, taskCategory]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleTaskPriorityFilterChange = (e: SelectChangeEvent<string>) => {
        setTaskPriorityFilter(e.target.value);
    };

    const handleTaskCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTaskCategory(e.target.value);
    };

    const handleTaskClick = (task: TaskType) => {
        dispatch(setSelectedTask(task))
        navigate('/tasks/taskDetail');
    };

    const handleDragTaskStart = (e: React.DragEvent<HTMLElement>, task: TaskType, currentStatus: string) => {
        e.dataTransfer.effectAllowed = "move";
        setDraggedTask({ task, currentStatus });
    };

    const handleDragTaskOver = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDropTask = async (e: React.DragEvent<HTMLElement>, newStatus: string) => {
        e.preventDefault();
        if (draggedTask && draggedTask.currentStatus !== newStatus) {
            await dispatch(updateTaskStatus({ taskId: draggedTask.task._id, status: newStatus.toLocaleLowerCase() }))
        }
        setDraggedTask(null);
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const scrollContainer = e.currentTarget;

        if (!loading && hasMoreTasks && scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
            setPage((prev) => prev + 1);
        }
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
        taskPriorityFilter,
        handleTaskPriorityFilterChange,
        taskCategory,
        handleTaskCategoryChange,
        search,
        handleSearchChange,
        handleDragTaskStart,
        handleDragTaskOver,
        handleDropTask,
        handleScroll,
        loading,
        success,
        error,
        openSnackbar,
        handleSnackbarClose,
    };
}

export default useTaskList;