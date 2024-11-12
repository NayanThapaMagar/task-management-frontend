import React, { useState, useRef } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    Chip,
    OutlinedInput,
    SelectChangeEvent
} from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { createTask } from '../../features/taskSlice';
import { fetchUserConnections, selectAllConnections } from '../../features/userConnectionSlice';
import { AppDispatch } from '../../store';
import { TaskCreate } from '../../types';
// import ReactQuill from 'react-quill';
// import 'react-quill/dist/quill.snow.css';

interface AddTaskModalProps {
    open: boolean;
    onClose: () => void;
    onSnackOpen: (message: string) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, onClose, onSnackOpen }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
    const [assignedTo, setAssignedTo] = useState<string[]>([]); // Store IDs here
    const dispatch = useDispatch<AppDispatch>();
    const allConnections = useSelector(selectAllConnections);
    const quillRef = useRef<any>(null);

    React.useEffect(() => {
        dispatch(fetchUserConnections());
    }, [dispatch]);

    const handleSubmit = async () => {
        if (!title || !description) {
            onSnackOpen("Title and description are required.");
            return;
        }

        try {
            const taskData: TaskCreate = {
                title,
                description,
                priority,
                assignedTo: assignedTo.length > 0 ? assignedTo : [] // Use connection IDs for submission
            };

            await dispatch(createTask(taskData)).unwrap();
            onSnackOpen("Task created successfully!");
            onClose();
        } catch (error: any) {
            onSnackOpen("Error creating task: " + (error?.message || "Unknown error"));
        }
    };

    const handleAssignedToChange = (event: SelectChangeEvent<string[]>) => {
        const {
            target: { value },
        } = event;
        setAssignedTo(typeof value === 'string' ? value.split(',') : value);
    };

    // const getAssignedUserNames = (selectedIds: string[]) => {
    //     return selectedIds
    //         .map((id) => {
    //             const user = allConnections.find((connection) => connection._id === id);
    //             return user ? user.username : '';
    //         })
    //         .join(', ');
    // };

    if (!open) return null; // Conditionally render only when open

    return (
        <Box>
            <form onSubmit={handleSubmit}>
                <Typography variant="h5">Add New Task</Typography>
                <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    required
                    sx={{ maxWidth: '300px' }}
                />

                <Box display="flex" flexWrap="wrap" flexDirection="column" gap={2}>
                    <Box>
                        <Typography variant="subtitle1">Description</Typography>
                        {/* <ReactQuill
                            ref={quillRef}
                            value={description}
                            onChange={setDescription}
                            style={{ marginBottom: '3rem', height: '250px' }}
                        /> */}
                    </Box>

                    <Box display="flex" flexWrap="wrap" flexDirection="row" gap={2}>
                        <Box flex={1} minWidth="200px">
                            <FormControl fullWidth margin="normal">
                                <InputLabel shrink>Priority</InputLabel>
                                <Select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                                    label="Priority"
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box flex={1} minWidth="200px">
                            <FormControl fullWidth margin="normal">
                                <InputLabel>Assign To</InputLabel>
                                <Select
                                    multiple
                                    value={assignedTo}
                                    onChange={handleAssignedToChange}
                                    input={<OutlinedInput label="Assign To" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const user = allConnections.find((connection) => connection._id === value);
                                                return user ? <Chip key={value} label={user.username} size='small' /> : null;
                                            })}
                                        </Box>
                                    )}
                                    MenuProps={{
                                        PaperProps: {
                                            style: {
                                                maxHeight: 200, // Control the height of the dropdown
                                                overflowY: 'auto', // Ensure scroll if needed
                                            },
                                        },
                                    }}
                                >
                                    {allConnections.map((connection) => (
                                        <MenuItem key={connection._id} value={connection._id}>
                                            {connection.username}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>
                    </Box>
                </Box>

                <Button variant="contained" type='submit'>
                    Add Task
                </Button>
                <Button onClick={onClose} sx={{ mt: 2 }}>
                    Close
                </Button>
            </form>
        </Box>
    );
};

export default AddTaskModal;
