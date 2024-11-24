import { SelectChangeEvent } from "@mui/material";
import { marked } from "marked";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAllTaskComments, updateTask, fetchAllTaskComments, resetSelectedTask, resetComments, setError, resetMessages as resetTaskMessages } from "../../features/taskSlice";
import { selectAllSubtasks, selectMySubtasks, selectAssignedSubtasks, fetchAllSubtasks, fetchMySubtasks, fetchAssignedSubtasks, updateSubtaskStatus, setSelectedSubtask, resetMessages as resetSubtaskMessages, resetSubtasks, resetMySubtasks, resetAssignedSubtasks, resetSubtaskAvailabilityIndicator } from '../../features/subtaskSlice';
import { selectAllConnections, fetchUserConnections } from "../../features/userConnectionSlice";
import { AppDispatch, RootState } from "../../store";
import htmlToMarkdown from "@wcj/html-to-markdown";
import { SubTask as SubtaskType } from '../../types';

const useTaskDetail = () => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const {
        loading: taskLoading,
        error: taskError,
        success: taskSuccess,
        selectedTask,
        hasMoreComments,
    } = useSelector((state: RootState) => state.tasks);

    const {
        loading: subtaskLoading,
        error: subtaskError,
        success: subtaskSuccess,
        hasMoreAllToDoSubtasks,
        hasMoreAllPendingSubtasks,
        hasMoreAllCompletedSubtasks,
        hasMoreMyToDoSubtasks,
        hasMoreMyPendingSubtasks,
        hasMoreMyCompletedSubtasks,
        hasMoreAssignedToDoSubtasks,
        hasMoreAssignedPendingSubtasks,
        hasMoreAssignedCompletedSubtasks,
    } = useSelector((state: RootState) => state.subtasks);

    const loading = taskLoading || subtaskLoading;
    const error = taskError || subtaskError;
    const success = taskSuccess || subtaskSuccess;

    // Task 
    const allConnections = useSelector(selectAllConnections);
    const allTaskComments = useSelector(selectAllTaskComments);

    const [openSnackbar, setOpenSnackbar] = useState(false);

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
    const [assignedTo, setAssignedTo] = useState<string[]>([]);

    const [isDescriptionHovered, setIsDescriptionHovered] = useState(false);

    const [editMode, setEditMode] = useState({
        title: false,
        description: false,
        priority: false,
        assignedTo: false,
    });

    const [commentPage, setCommentPage] = useState(1);

    // subtask

    const allSubtasks = useSelector(selectAllSubtasks);
    const mySubtasks = useSelector(selectMySubtasks);
    const assignedSubtasks = useSelector(selectAssignedSubtasks);

    const [subtaskPriorityFilter, setSubtaskPriorityFilter] = useState('all');
    const [subtaskCategory, setSubtaskCategory] = useState('all');


    const [isSubtasksAtScrollTop, setIsSubtasksAtScrollTop] = useState(true);

    const [allSubtasksPage, setAllSubtasksPage] = useState(1);
    const [mySubtasksPage, setMySubtasksPage] = useState(1);
    const [assignedSubtasksPage, setAssignedSubtasksPage] = useState(1);

    const [listSubtasks, setListSubtasks] = useState<SubtaskType[]>([]);

    const [draggedSubtask, setDraggedSubtask] = useState<{ subtask: SubtaskType; currentStatus: string } | null>(null);

    // Tasks
    const convertMarkDownToHtml = async (value: string) => {
        const htmlValue = await marked(value)
        return htmlValue;
    }

    useEffect(() => {
        if (!selectedTask) {
            navigate('/tasks');
        }
    }, []);

    useEffect(() => {
        const setTaskDetail = async () => {
            if (selectedTask) {
                const htmlDescription = await convertMarkDownToHtml(selectedTask.description);
                setDescription(htmlDescription);
                setTitle(selectedTask.title);
                setPriority(selectedTask.priority);
                setAssignedTo(selectedTask.assignedTo);
            }
        };
        setTaskDetail();
    }, [selectedTask]);

    const fetchComments = async () => {
        if (selectedTask) {
            await dispatch(fetchAllTaskComments({ taskId: selectedTask._id, params: { page: commentPage, limit: 10 } }));
        }
    }

    useEffect(() => {
        dispatch(fetchUserConnections());
        fetchComments();
        return () => { dispatch(resetComments()) }
    }, [dispatch]);

    useEffect(() => {
        // fetching more COMMENTS if any
        if (commentPage > 1) {
            fetchComments();
        }
    }, [commentPage]);

    // Subtasks

    const fetchSubtasksAtFirstPage = async () => {
        const query: Record<string, string> = {};
        if (subtaskPriorityFilter !== 'all') query.priority = subtaskPriorityFilter;

        // console.log(`Fetching ${allSubtasksPage !== 1 ? 'more' : ''} all subtasks at page ${allSubtasksPage}`);

        dispatch(fetchAllSubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'to do', page: 1, limit: 5 } }));
        dispatch(fetchAllSubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'pending', page: 1, limit: 5 } }));
        dispatch(fetchAllSubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'completed', page: 1, limit: 5 } }));

        // console.log(`Fetching ${mySubtasksPage !== 1 ? 'more' : ''} mysubtasks at page ${mySubtasksPage}`);

        dispatch(fetchMySubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'to do', page: 1, limit: 5 } }));
        dispatch(fetchMySubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'pending', page: 1, limit: 5 } }));
        dispatch(fetchMySubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'completed', page: 1, limit: 5 } }));

        // console.log(`Fetching ${assignedSubtasksPage !== 1 ? 'more' : ''} assignedsubtasks at page ${assignedSubtasksPage}`);

        dispatch(fetchAssignedSubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'to do', page: 1, limit: 5 } }));
        dispatch(fetchAssignedSubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'pending', page: 1, limit: 5 } }));
        dispatch(fetchAssignedSubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'completed', page: 1, limit: 5 } }));

    };
    const fetchMoreSubtasks = async () => {
        const query: Record<string, string> = {};
        if (subtaskPriorityFilter !== 'all') query.priority = subtaskPriorityFilter;

        if (subtaskCategory === 'all') {
            // console.log(`Fetching ${allSubtasksPage !== 1 ? 'more' : ''} allsubtasks at page ${allSubtasksPage}`);

            hasMoreAllToDoSubtasks && dispatch(fetchAllSubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'to do', page: allSubtasksPage, limit: 5 } }));
            hasMoreAllPendingSubtasks && dispatch(fetchAllSubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'pending', page: allSubtasksPage, limit: 5 } }));
            hasMoreAllCompletedSubtasks && dispatch(fetchAllSubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'completed', page: allSubtasksPage, limit: 5 } }));
        } else if (subtaskCategory === 'myTasks') {
            // console.log(`Fetching ${mySubtasksPage !== 1 ? 'more' : ''} mysubtasks at page ${mySubtasksPage}`);

            hasMoreMyToDoSubtasks && dispatch(fetchMySubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'to do', page: mySubtasksPage, limit: 5 } }));
            hasMoreMyPendingSubtasks && dispatch(fetchMySubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'pending', page: mySubtasksPage, limit: 5 } }));
            hasMoreMyCompletedSubtasks && dispatch(fetchMySubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'completed', page: mySubtasksPage, limit: 5 } }));
        } else if (subtaskCategory === 'assignedTasks') {
            // console.log(`Fetching ${assignedSubtasksPage !== 1 ? 'more' : ''} assignedsubtasks at page ${assignedSubtasksPage}`);

            hasMoreAssignedToDoSubtasks && dispatch(fetchAssignedSubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'to do', page: assignedSubtasksPage, limit: 5 } }));
            hasMoreAssignedPendingSubtasks && dispatch(fetchAssignedSubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'pending', page: assignedSubtasksPage, limit: 5 } }));
            hasMoreAssignedCompletedSubtasks && dispatch(fetchAssignedSubtasks({ taskId: selectedTask!._id, params: { ...query, status: 'completed', page: assignedSubtasksPage, limit: 5 } }));
        }
    };

    useEffect(() => {
        // fetching more task if any
        if (allSubtasksPage > 1 || mySubtasksPage > 1 || assignedSubtasksPage > 1) {
            fetchMoreSubtasks();
        }
    }, [allSubtasksPage, mySubtasksPage, assignedSubtasksPage]);

    useEffect(() => {
        setAllSubtasksPage(1)
        setMySubtasksPage(1)
        setAssignedSubtasksPage(1)
        dispatch(resetSubtasks())
        dispatch(resetMySubtasks())
        dispatch(resetAssignedSubtasks())
        dispatch(resetSubtaskAvailabilityIndicator())

        fetchSubtasksAtFirstPage();
        return () => {
            dispatch(resetSubtasks())
            dispatch(resetMySubtasks())
            dispatch(resetAssignedSubtasks())
        }
    }, [subtaskPriorityFilter, selectedTask]);

    useEffect(() => {
        const subtasks = subtaskCategory === 'all' ? allSubtasks : subtaskCategory === 'myTasks' ? mySubtasks : assignedSubtasks;
        setListSubtasks(subtasks);
    }, [allSubtasks, mySubtasks, assignedSubtasks, subtaskCategory]);


    //------------------------------//
    // Tasks
    const handleAssignedToChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setAssignedTo(typeof value === 'string' ? value.split(',') : value);
    };

    const convertHtmlToMarkdown = async () => {
        const markdown = await htmlToMarkdown({ html: description });
        return markdown;
    };

    const handleUpdate = async () => {
        try {
            const markedDownDescription = await convertHtmlToMarkdown();

            const strippedDescription = description.replace(/<[^>]+>/g, '').trim();
            if (!strippedDescription || !markedDownDescription) {
                dispatch(setError('Description is required'))
                return;
            }

            const updatedTask = {
                taskId: selectedTask!._id,
                updates: { title, description: markedDownDescription, priority, assignedTo },
            };
            await dispatch(updateTask(updatedTask)).unwrap();
            setEditMode({ title: false, description: false, priority: false, assignedTo: false });
        } catch (error: any) {
            // console.error(error);
        }
    };

    const handleComponentClick = (field: keyof typeof editMode) => {
        setEditMode((prev) => ({ ...prev, [field]: true }));
    };

    const handleCommentsScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const scrollContainer = e.currentTarget;

        // console.log('Scrolling at comments botom:', scrollContainer.scrollTop + scrollContainer.clientHeight + 1 >= scrollContainer.scrollHeight);

        if (!loading && hasMoreComments && scrollContainer.scrollTop + scrollContainer.clientHeight >= scrollContainer.scrollHeight) {
            setCommentPage((prev) => prev + 1);
        }
    };


    // Subtasks

    const handleSubtaskPriorityFilterChange = (e: SelectChangeEvent<string>) => {
        setSubtaskPriorityFilter(e.target.value);
    };

    const handleSubtaskCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSubtaskCategory(e.target.value);
    };

    const handleSubtaskClick = (subtask: SubtaskType) => {
        dispatch(setSelectedSubtask(subtask))
        navigate('/tasks/subtaskDetail');
    };

    const handleDragSubtaskStart = (e: React.DragEvent<HTMLElement>, subtask: SubtaskType, currentStatus: string) => {
        e.dataTransfer.effectAllowed = "move";
        setDraggedSubtask({ subtask, currentStatus });
    };

    const handleDragSubtaskOver = (e: React.DragEvent<HTMLElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDropSubtask = async (e: React.DragEvent<HTMLElement>, newStatus: string) => {
        e.preventDefault();
        if (draggedSubtask && draggedSubtask.currentStatus !== newStatus) {
            await dispatch(updateSubtaskStatus({ taskId: selectedTask!._id, subtaskId: draggedSubtask.subtask._id, status: newStatus.toLocaleLowerCase() }))
        }
        setDraggedSubtask(null);
    };

    const handleSubtasksScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const scrollContainer = e.currentTarget;

        setIsSubtasksAtScrollTop(scrollContainer.scrollTop === 0)

        // console.log('Scrolling at subtasks botom:', scrollContainer.scrollTop + scrollContainer.clientHeight + 1 >= scrollContainer.scrollHeight);

        if (!loading && subtaskCategory === 'all' && (hasMoreAllToDoSubtasks || hasMoreAllPendingSubtasks || hasMoreAllCompletedSubtasks) && scrollContainer.scrollTop + scrollContainer.clientHeight + 1 >= scrollContainer.scrollHeight) {
            setAllSubtasksPage((prev) => prev + 1);
        }
        if (!loading && subtaskCategory === 'myTasks' && (hasMoreMyToDoSubtasks || hasMoreMyPendingSubtasks || hasMoreMyCompletedSubtasks) && scrollContainer.scrollTop + scrollContainer.clientHeight + 1 >= scrollContainer.scrollHeight) {
            setMySubtasksPage((prev) => prev + 1);
        }
        if (!loading && subtaskCategory === 'assignedTasks' && (hasMoreAssignedToDoSubtasks || hasMoreAssignedPendingSubtasks || hasMoreAssignedCompletedSubtasks) && scrollContainer.scrollTop + scrollContainer.clientHeight + 1 >= scrollContainer.scrollHeight) {
            setAssignedSubtasksPage((prev) => prev + 1);
        }
    };

    //-----//

    const handleClose = () => {
        dispatch(resetSelectedTask());
        navigate('/tasks');
    };

    useEffect(() => {
        if (error || success) {
            setOpenSnackbar(true);
        }
    }, [error, success]);

    const handleSnackbarClose = () => {
        dispatch(resetTaskMessages());
        dispatch(resetSubtaskMessages());
        setOpenSnackbar(false);
    };

    const groupedSubtasks = {
        'To Do': listSubtasks.filter((task) => task.status === 'to do'),
        'Pending': listSubtasks.filter((task) => task.status === 'pending'),
        'Completed': listSubtasks.filter((task) => task.status === 'completed'),
    };

    return {
        editMode,
        selectedTask,
        title,
        description,
        priority,
        assignedTo,
        allConnections,
        allTaskComments,
        setTitle,
        setDescription,
        setPriority,
        isDescriptionHovered,
        setIsDescriptionHovered,
        handleAssignedToChange,
        handleComponentClick,
        handleUpdate,
        groupedSubtasks,
        handleSubtaskClick,
        subtaskPriorityFilter,
        handleSubtaskPriorityFilterChange,
        subtaskCategory,
        handleSubtaskCategoryChange,
        handleDragSubtaskStart,
        handleDragSubtaskOver,
        handleDropSubtask,
        isSubtasksAtScrollTop,
        handleSubtasksScroll,
        handleCommentsScroll,
        handleClose,
        loading,
        success,
        error,
        openSnackbar,
        handleSnackbarClose,
    }

}

export default useTaskDetail;