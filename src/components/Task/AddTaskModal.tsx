import React, { useState } from 'react';
import {
    Box,
    TextField,
    Button,
    Typography,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
} from '@mui/material';
import { useDispatch } from 'react-redux';
import { createTask } from '../../features/taskSlice';
import { AppDispatch } from '../../store';
import { TaskCreate } from '../../types';

interface AddTaskModalProps {
    open: boolean;
    onClose: () => void;
    onSnackOpen: (message: string) => void;
}

const AddTaskModal: React.FC<AddTaskModalProps> = ({ open, onClose, onSnackOpen }) => {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
    const [assignedTo, setAssignedTo] = useState<string[]>([]);
    const dispatch = useDispatch<AppDispatch>();

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
                assignedTo: assignedTo.length > 0 ? assignedTo : []
            };

            await dispatch(createTask(taskData)).unwrap();
            onSnackOpen("Task created successfully!");
            onClose();
        } catch (error: any) {
            onSnackOpen("Error creating task: " + (error?.message || "Unknown error"));
        }
    };

    if (!open) return null; // Conditionally render only when open

    return (
        <Box>
            <Typography variant="h5">Add New Task</Typography>
            <TextField
                label="Title"
                fullWidth
                margin="normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <TextField
                label="Description"
                fullWidth
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
            />
            <FormControl fullWidth margin="normal">
                <InputLabel>Priority</InputLabel>
                <Select
                    value={priority}
                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                >
                    <MenuItem value="low">Low</MenuItem>
                    <MenuItem value="medium">Medium</MenuItem>
                    <MenuItem value="high">High</MenuItem>
                </Select>
            </FormControl>
            <TextField
                label="Assigned To (comma separated)"
                fullWidth
                margin="normal"
                value={assignedTo.join(', ')}
                onChange={(e) => setAssignedTo(e.target.value.split(',').map(user => user.trim()))}
            />
            <Button variant="contained" onClick={handleSubmit}>
                Add Task
            </Button>
            <Button onClick={onClose} sx={{ mt: 2 }}>
                Close
            </Button>
        </Box>
    );
};

export default AddTaskModal;
