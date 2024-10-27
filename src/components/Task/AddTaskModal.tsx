import React, { useState } from 'react';
import {
    Modal,
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
        // Validate that title and description are provided
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

            // Dispatch the action to create a new task
            await dispatch(createTask(taskData)).unwrap();
            onSnackOpen("Task created successfully!"); 
            onClose(); 
        } catch (error: any) {
            onSnackOpen("Error creating task: " + (error?.message || "Unknown error")); 
        }
    };

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 1, boxShadow: 3 }}>
                <Typography variant="h6">Add New Task</Typography>
                <TextField
                    label="Title"
                    fullWidth
                    margin="normal"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)} 
                />
                <TextField
                    label="Description"
                    fullWidth
                    margin="normal"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
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
            </Box>
        </Modal>
    );
};

export default AddTaskModal;
