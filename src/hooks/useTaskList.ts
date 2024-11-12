import React, { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Task as TaskType } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllTasks, selectMyTasks, selectAssignedTasks, fetchAllTasks, fetchMyTasks, fetchAssignedTasks, setSelectedTask, resetMessages } from '../features/taskSlice';
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
    const [listTasks, setListTasks] = useState<TaskType[]>([]);
    const [view, setView] = useState('all');

    const handleTaskClick = (task: TaskType) => {
        dispatch(setSelectedTask(task))
        navigate('/tasks/detail');
    };

    const fetchData = async () => {
        const query: Record<string, string> = {};
        if (priorityFilter !== 'all') query.priority = priorityFilter;

        if (view === 'all') {
            await dispatch(fetchAllTasks({ ...query, page: 1, limit: 10 }));
        } else if (view === 'myTasks') {
            await dispatch(fetchMyTasks({ ...query, page: 1, limit: 10 }));
        } else if (view === 'assignedTasks') {
            await dispatch(fetchAssignedTasks({ ...query, page: 1, limit: 10 }));
        }
    };

    useEffect(() => {
        fetchData();
    }, [priorityFilter, view, dispatch]);

    useEffect(() => {
        const tasks = view === 'all' ? allTasks : view === 'myTasks' ? myTasks : assignedTasks;
        const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));
        setListTasks(filteredTasks);
    }, [allTasks, myTasks, assignedTasks, search, view]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handlePriorityFilterChange = (e: SelectChangeEvent<string>) => {
        setPriorityFilter(e.target.value);
    };

    const handleViewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setView(e.target.value);
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
        view,
        handleViewChange,
        search,
        handleSearchChange,
        loading,
        success,
        error,
        openSnackbar,
        handleSnackbarClose,
    };
}

export default useTaskList;