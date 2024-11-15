import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createSubtask, setSelectedSubtask, resetMessages, setError } from '../../features/subtaskSlice';
import { fetchUserConnections, selectAllConnections } from '../../features/userConnectionSlice';
import { AppDispatch, RootState } from '../../store';
import { TaskCreate } from '../../types';
import { SelectChangeEvent } from '@mui/material';
import htmlToMarkdown from "@wcj/html-to-markdown";

const useAddSubtask = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { error, loading, success } = useSelector((state: RootState) => state.subtasks);
    const { selectedTask } = useSelector((state: RootState) => state.tasks);

    const taskId = selectedTask?._id as string

    const allConnections = useSelector(selectAllConnections);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
    const [assignedTo, setAssignedTo] = useState<string[]>([]);


    useEffect(() => {
        dispatch(fetchUserConnections());
    }, [dispatch]);

    const convertHtmlToMarkdown = async () => {
        const markdown = await htmlToMarkdown({ html: description });
        return markdown;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const markedDownDescription = await convertHtmlToMarkdown();

        const strippedDescription = description.replace(/<[^>]+>/g, '').trim();
        if (!strippedDescription || !markedDownDescription) {
            dispatch(setError('Description is required'))
            return;
        }

        const subtaskData: TaskCreate = {
            title,
            description: markedDownDescription,
            priority,
            assignedTo: assignedTo.length > 0 ? assignedTo : []
        };

        const dispatchResponse = await dispatch(createSubtask({ taskId, subtaskData }));

        if (dispatchResponse) {
            dispatch(setSelectedSubtask(dispatchResponse.payload.subtask))
        }
        navigate('/tasks/subtaskDetail');
    };

    // Handle changes in the assignedTo select
    const handleAssignedToChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setAssignedTo(typeof value === 'string' ? value.split(',') : value);
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
        title,
        setTitle,
        description,
        setDescription,
        priority,
        setPriority,
        assignedTo,
        setAssignedTo,
        allConnections,
        loading,
        success,
        error,
        openSnackbar,
        handleSubmit,
        handleAssignedToChange,
        handleSnackbarClose,
    };
};

export default useAddSubtask;