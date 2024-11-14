import { SelectChangeEvent } from "@mui/material";
import { marked } from "marked";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { updateTask, resetSelectedTask, setError, resetMessages } from "../features/taskSlice";
import { selectAllConnections, fetchUserConnections } from "../features/userConnectionSlice";
import { AppDispatch, RootState } from "../store";
import htmlToMarkdown from "@wcj/html-to-markdown";

const useTaskDetail = () => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { loading, error, success, selectedTask } = useSelector((state: RootState) => state.tasks);

    const allConnections = useSelector(selectAllConnections);

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

    useEffect(() => {
        dispatch(fetchUserConnections());
    }, [dispatch]);

    const convertMarkDownToHtml = async (value: string) => {
        const htmlValue = await marked(value)
        return htmlValue;
    }

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
            console.error(error);
        }
    };

    const handleComponentClick = (field: keyof typeof editMode) => {
        setEditMode((prev) => ({ ...prev, [field]: true }));
    };

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
        dispatch(resetMessages());
        setOpenSnackbar(false);
    };

    return {
        editMode,
        selectedTask,
        title,
        description,
        priority,
        assignedTo,
        allConnections,
        setTitle,
        setDescription,
        setPriority,
        isDescriptionHovered,
        setIsDescriptionHovered,
        handleAssignedToChange,
        handleComponentClick,
        handleUpdate,
        handleClose,
        loading,
        success,
        error,
        openSnackbar,
        handleSnackbarClose,
    }

}

export default useTaskDetail;