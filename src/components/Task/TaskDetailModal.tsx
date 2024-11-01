import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Task } from '../../types'; 
import { useDispatch } from 'react-redux';
import { updateTask } from '../../features/taskSlice'; 
import { AppDispatch } from '../../store'; 
import dayjs from 'dayjs'; 

interface TaskDetailModalProps {
    open: boolean;
    onClose: () => void;
    task: Task | null;
    onSnackOpen: (message: string) => void; 
}

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({ open, onClose, task, onSnackOpen }) => {
    const dispatch = useDispatch<AppDispatch>(); 
    const [editMode, setEditMode] = useState(false);
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');

    // Effect to set task details when the task prop changes
    useEffect(() => {
        if (task) {
            setTitle(task.title);
            setDescription(task.description);
            setPriority(task.priority);
        }
    }, [task]);

    // Handle task update
    const handleUpdate = async () => {
        try {
            // Prepare updated task data
            const updatedTask = {
                taskId: task!._id, 
                updates: { title, description, priority }
            };
            await dispatch(updateTask(updatedTask)).unwrap();
            onSnackOpen("Task updated successfully!"); 
            setEditMode(false); 
        } catch (error: any) {
            onSnackOpen("Error updating task: " + (error?.message || "Unknown error")); 
        }
    };

    const handleEditToggle = () => {
        setEditMode(!editMode);
    };

    if (!task) return null;

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ padding: 2, backgroundColor: 'white', borderRadius: 1, boxShadow: 3 }}>
                {editMode ? (
                    <>
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
                        <Button variant="contained" onClick={handleUpdate}>
                            Save Changes
                        </Button>
                        <Button onClick={handleEditToggle}>Cancel</Button>
                    </>
                ) : (
                    <>
                        <Typography variant="h6">{task.title}</Typography>
                        <Typography variant="body1">Description: {task.description}</Typography>
                        <Typography variant="body1">Priority: {task.priority}</Typography>
                        <Typography variant="body1">Status: {task.status}</Typography>
                        <Typography variant="body1">Created At: {dayjs(task.createdAt).format('MMMM D, YYYY h:mm A')}</Typography>
                        <Button variant="contained" onClick={handleEditToggle}>
                            Edit Task
                        </Button>
                    </>
                )}
            </Box>
        </Modal>
    );
};

export default TaskDetailModal;
