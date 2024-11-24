import React, { useEffect, useState } from 'react';
import { SelectChangeEvent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Task as TaskType } from '../../types';
import { useDispatch, useSelector } from 'react-redux';
import { selectAllTasks, selectMyTasks, selectAssignedTasks, fetchAllTasks, fetchMyTasks, fetchAssignedTasks, updateTaskStatus, setSelectedTask, resetMessages, resetTasks, resetMyTasks, resetAssignedTasks, resetTaskAvailabilityIndicator } from '../../features/taskSlice';
import { AppDispatch, RootState } from '../../store';

const useTaskList = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {
        loading,
        error,
        success,
        hasMoreAllToDoTasks,
        hasMoreAllPendingTasks,
        hasMoreAllCompletedTasks,
        hasMoreMyToDoTasks,
        hasMoreMyPendingTasks,
        hasMoreMyCompletedTasks,
        hasMoreAssignedToDoTasks,
        hasMoreAssignedPendingTasks,
        hasMoreAssignedCompletedTasks,
    }
        = useSelector((state: RootState) => state.tasks);

    const allTasks = useSelector(selectAllTasks);
    const myTasks = useSelector(selectMyTasks);
    const assignedTasks = useSelector(selectAssignedTasks);

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [isTasksAtScrollTop, setIsTasksAtScrollTop] = useState(true);

    const [search, setSearch] = useState('');
    const [taskPriorityFilter, setTaskPriorityFilter] = useState('all');
    const [taskCategory, setTaskCategory] = useState('all');

    const [allTasksPage, setAllTasksPage] = useState(1);
    const [myTasksPage, setMyTasksPage] = useState(1);
    const [assignedTasksPage, setAssignedTasksPage] = useState(1);

    const [listTasks, setListTasks] = useState<TaskType[]>([]);

    const [draggedTask, setDraggedTask] = useState<{ task: TaskType; currentStatus: string } | null>(null);

    const fetchTasksAtFirstPage = async () => {
        const query: Record<string, string> = {};
        if (taskPriorityFilter !== 'all') query.priority = taskPriorityFilter;

        // console.log(`Fetching ${allTasksPage !== 1 ? 'more' : ''} alltasks at page ${allTasksPage}`);

        dispatch(fetchAllTasks({ ...query, status: 'to do', page: 1, limit: 5 }));
        dispatch(fetchAllTasks({ ...query, status: 'pending', page: 1, limit: 5 }));
        dispatch(fetchAllTasks({ ...query, status: 'completed', page: 1, limit: 5 }));

        // console.log(`Fetching ${myTasksPage !== 1 ? 'more' : ''} mytasks at page ${myTasksPage}`);

        dispatch(fetchMyTasks({ ...query, status: 'to do', page: 1, limit: 5 }));
        dispatch(fetchMyTasks({ ...query, status: 'pending', page: 1, limit: 5 }));
        dispatch(fetchMyTasks({ ...query, status: 'completed', page: 1, limit: 5 }));

        // console.log(`Fetching ${assignedTasksPage !== 1 ? 'more' : ''} assignedtasks at page ${assignedTasksPage}`);

        dispatch(fetchAssignedTasks({ ...query, status: 'to do', page: 1, limit: 5 }));
        dispatch(fetchAssignedTasks({ ...query, status: 'pending', page: 1, limit: 5 }));
        dispatch(fetchAssignedTasks({ ...query, status: 'completed', page: 1, limit: 5 }));
    };
    const fetchMoreTasks = async () => {
        const query: Record<string, string> = {};
        if (taskPriorityFilter !== 'all') query.priority = taskPriorityFilter;

        if (taskCategory === 'all') {

            // console.log(`Fetching ${allTasksPage !== 1 ? 'more' : ''} alltasks at page ${allTasksPage}`);

            hasMoreAllToDoTasks && dispatch(fetchAllTasks({ ...query, status: 'to do', page: allTasksPage, limit: 5 }));
            hasMoreAllPendingTasks && dispatch(fetchAllTasks({ ...query, status: 'pending', page: allTasksPage, limit: 5 }));
            hasMoreAllCompletedTasks && dispatch(fetchAllTasks({ ...query, status: 'completed', page: allTasksPage, limit: 5 }));
        } else if (taskCategory === 'myTasks') {

            // console.log(`Fetching ${myTasksPage !== 1 ? 'more' : ''} mytasks at page ${myTasksPage}`);

            hasMoreMyToDoTasks && dispatch(fetchMyTasks({ ...query, status: 'to do', page: myTasksPage, limit: 5 }));
            hasMoreMyPendingTasks && dispatch(fetchMyTasks({ ...query, status: 'pending', page: myTasksPage, limit: 5 }));
            hasMoreMyCompletedTasks && dispatch(fetchMyTasks({ ...query, status: 'completed', page: myTasksPage, limit: 5 }));
        } else if (taskCategory === 'assignedTasks') {

            // console.log(`Fetching ${assignedTasksPage !== 1 ? 'more' : ''} assignedtasks at page ${assignedTasksPage}`);

            hasMoreAssignedToDoTasks && dispatch(fetchAssignedTasks({ ...query, status: 'to do', page: assignedTasksPage, limit: 5 }));
            hasMoreAssignedPendingTasks && dispatch(fetchAssignedTasks({ ...query, status: 'pending', page: assignedTasksPage, limit: 5 }));
            hasMoreAssignedCompletedTasks && dispatch(fetchAssignedTasks({ ...query, status: 'completed', page: assignedTasksPage, limit: 5 }));
        }
    };

    useEffect(() => {
        // fetching more task if any
        if (allTasksPage > 1 || myTasksPage > 1 || assignedTasksPage > 1) {
            fetchMoreTasks();
        }
    }, [allTasksPage, myTasksPage, assignedTasksPage]);

    useEffect(() => {
        setAllTasksPage(1)
        setMyTasksPage(1)
        setAssignedTasksPage(1)
        dispatch(resetTasks())
        dispatch(resetMyTasks())
        dispatch(resetAssignedTasks())
        dispatch(resetTaskAvailabilityIndicator())

        fetchTasksAtFirstPage();
        return () => {
            dispatch(resetTasks())
            dispatch(resetMyTasks())
            dispatch(resetAssignedTasks())
        }
    }, [taskPriorityFilter]);

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

        setIsTasksAtScrollTop(scrollContainer.scrollTop === 0)

        if (!loading && taskCategory === 'all' && (hasMoreAllToDoTasks || hasMoreAllPendingTasks || hasMoreAllCompletedTasks) && scrollContainer.scrollTop + scrollContainer.clientHeight + 1 >= scrollContainer.scrollHeight) {
            setAllTasksPage((prev) => prev + 1);
        }
        if (!loading && taskCategory === 'myTasks' && (hasMoreMyToDoTasks || hasMoreMyPendingTasks || hasMoreMyCompletedTasks) && scrollContainer.scrollTop + scrollContainer.clientHeight + 1 >= scrollContainer.scrollHeight) {
            setMyTasksPage((prev) => prev + 1);
        }
        if (!loading && taskCategory === 'assignedTasks' && (hasMoreAssignedToDoTasks || hasMoreAssignedPendingTasks || hasMoreAssignedCompletedTasks) && scrollContainer.scrollTop + scrollContainer.clientHeight + 1 >= scrollContainer.scrollHeight) {
            setAssignedTasksPage((prev) => prev + 1);
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
        isTasksAtScrollTop,
        handleScroll,
        loading,
        success,
        error,
        openSnackbar,
        handleSnackbarClose,
    };
}

export default useTaskList;