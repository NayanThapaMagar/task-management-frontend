import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { createTask, resetMessages, setError } from '../features/taskSlice';
import { fetchUserConnections, selectAllConnections } from '../features/userConnectionSlice';
import { AppDispatch, RootState } from '../store';
import { TaskCreate } from '../types';
import { SelectChangeEvent } from '@mui/material';

const useAddTask = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { error, loading, success } = useSelector((state: RootState) => state.tasks);

    const allConnections = useSelector(selectAllConnections);

    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
    const [assignedTo, setAssignedTo] = useState<string[]>([]);

    useEffect(() => {
        dispatch(fetchUserConnections());
    }, [dispatch]);

    useEffect(() => {
        if (error || success) {
            setOpenSnackbar(true);
        }
    }, [error, success]);

    const handleSnackbarClose = () => {
        console.log('handling snackbar close in add task');
        dispatch(resetMessages());
        setOpenSnackbar(false);
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const strippedDescription = description.replace(/<[^>]+>/g, '').trim();
        if (!strippedDescription) {
            dispatch(setError('Description is required'))
            return;
        }

        const taskData: TaskCreate = {
            title,
            description,
            priority,
            assignedTo: assignedTo.length > 0 ? assignedTo : []
        };

        await dispatch(createTask(taskData));
        navigate('/tasks');
    };

    // Handle changes in the assignedTo select
    const handleAssignedToChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setAssignedTo(typeof value === 'string' ? value.split(',') : value);
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

export default useAddTask;