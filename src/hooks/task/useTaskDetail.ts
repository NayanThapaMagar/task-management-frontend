import { SelectChangeEvent } from "@mui/material";
import { marked } from "marked";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAllTaskComments, updateTask, fetchAllTaskComments, resetSelectedTask, setError, resetMessages as resetTaskMessages } from "../../features/taskSlice";
import { selectAllSubtasks, selectMySubtasks, selectAssignedSubtasks, fetchAllSubtasks, fetchMySubtasks, fetchAssignedSubtasks, updateSubtaskStatus, setSelectedSubtask, resetMessages as resetSubtaskMessages } from '../../features/subtaskSlice';
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
        selectedTask
    } = useSelector((state: RootState) => state.tasks);

    const {
        loading: subtaskLoading,
        error: subtaskError,
        success: subtaskSuccess,
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
    // subtask
    const allSubtasks = useSelector(selectAllSubtasks);
    const mySubtasks = useSelector(selectMySubtasks);
    const assignedSubtasks = useSelector(selectAssignedSubtasks);

    const [listSubtasks, setListSubtasks] = useState<SubtaskType[]>([]);
    const [subtaskPriorityFilter, setSubtaskPriorityFilter] = useState('all');
    const [subtaskCategory, setSubtaskCategory] = useState('all');

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

    useEffect(() => {
        dispatch(fetchUserConnections());
        if (selectedTask) {
            dispatch(fetchAllTaskComments(selectedTask._id));
        }
    }, [dispatch]);


    // Subtasks

    const fetchSubtasks = async () => {
        if (selectedTask) {
            const query: Record<string, string> = {};
            if (subtaskPriorityFilter !== 'all') query.priority = subtaskPriorityFilter;

            if (subtaskCategory === 'all') {
                await dispatch(fetchAllSubtasks({ taskId: selectedTask!._id, params: { ...query, page: 1, limit: 20 } }));
            } else if (subtaskCategory === 'myTasks') {
                await dispatch(fetchMySubtasks({ taskId: selectedTask!._id, params: { ...query, page: 1, limit: 20 } }));
            } else if (subtaskCategory === 'assignedTasks') {
                await dispatch(fetchAssignedSubtasks({ taskId: selectedTask!._id, params: { ...query, page: 1, limit: 20 } }));
            }
        }
    };

    useEffect(() => {
        fetchSubtasks();
    }, [subtaskPriorityFilter, subtaskCategory, selectedTask, dispatch]);

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
        handleClose,
        loading,
        success,
        error,
        openSnackbar,
        handleSnackbarClose,
    }

}

export default useTaskDetail;