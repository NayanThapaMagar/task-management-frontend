import { SelectChangeEvent } from "@mui/material";
import { marked } from "marked";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { selectAllSubtaskComments, updateSubtask, resetSelectedSubtask, fetchAllSubtaskComments, setError, resetMessages } from "../../features/subtaskSlice";
import { selectAllConnections, fetchUserConnections } from "../../features/userConnectionSlice";
import { AppDispatch, RootState } from "../../store";
import htmlToMarkdown from "@wcj/html-to-markdown";

const useSubtaskDetail = () => {

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { selectedTask } = useSelector((state: RootState) => state.tasks);
    const { loading, error, success, selectedSubtask } = useSelector((state: RootState) => state.subtasks);

    const allConnections = useSelector(selectAllConnections);
    const allSubtaskComments = useSelector(selectAllSubtaskComments);

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

    const convertMarkDownToHtml = async (value: string) => {
        const htmlValue = await marked(value)
        return htmlValue;
    }

    useEffect(() => {
        const setSubtaskDetail = async () => {
            if (selectedSubtask) {
                const htmlDescription = await convertMarkDownToHtml(selectedSubtask.description);
                setDescription(htmlDescription);
                setTitle(selectedSubtask.title);
                setPriority(selectedSubtask.priority);
                setAssignedTo(selectedSubtask.assignedTo);
            }
        };
        setSubtaskDetail();
    }, [selectedSubtask]);

    useEffect(() => {
        dispatch(fetchUserConnections());
        dispatch(fetchAllSubtaskComments({
            taskId: selectedTask!._id,
            subtaskId: selectedSubtask!._id,
        }));
    }, [dispatch]);

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

            const updatedSubtask = {
                taskId: selectedTask!._id,
                subtaskId: selectedSubtask!._id,
                updates: { title, description: markedDownDescription, priority, assignedTo },
            };
            await dispatch(updateSubtask(updatedSubtask)).unwrap();
            setEditMode({ title: false, description: false, priority: false, assignedTo: false });
        } catch (error: any) {
            console.error(error);
        }
    };

    const handleComponentClick = (field: keyof typeof editMode) => {
        setEditMode((prev) => ({ ...prev, [field]: true }));
    };

    const handleClose = () => {
        dispatch(resetSelectedSubtask());
        navigate('/tasks/taskDetail');
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
        selectedSubtask,
        title,
        description,
        priority,
        assignedTo,
        allConnections,
        allSubtaskComments,
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

export default useSubtaskDetail;