import React, { useState, useEffect, useRef } from 'react';
import { Box, Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, SelectChangeEvent, Divider, Container } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import { useDispatch, useSelector } from 'react-redux';
import { updateTask, resetSelectedTask } from '../../features/taskSlice';
import { AppDispatch, RootState } from '../../store';
import { useNavigate } from 'react-router-dom';
import { fetchUserConnections, selectAllConnections } from '../../features/userConnectionSlice';
import { marked } from 'marked';
import { BorderAll } from '@mui/icons-material';

const TaskDetail: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { selectedTask } = useSelector((state: RootState) => state.tasks);
    const allConnections = useSelector(selectAllConnections);

    const [editMode, setEditMode] = useState({
        title: false,
        description: false,
        priority: false,
        assignedTo: false,
    });
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('low');
    const [assignedTo, setAssignedTo] = useState<string[]>([]);


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

    const handleUpdate = async () => {
        try {
            const updatedTask = {
                taskId: selectedTask!._id,
                updates: { title, description, priority, assignedTo },
            };
            await dispatch(updateTask(updatedTask)).unwrap();
            setEditMode({ title: false, description: false, priority: false, assignedTo: false });
        } catch (error: any) {
            console.error(error);
        }
    };

    const handleClick = (field: keyof typeof editMode) => {
        setEditMode((prev) => ({ ...prev, [field]: true }));
    };

    const handleClose = () => {
        dispatch(resetSelectedTask());
        navigate('/tasks');
    };

    return (
        <Container>
            <Box sx={{ p: 3, mt: 2 }}>
                <Typography variant="h5">Task Detail</Typography>
                <Divider sx={{ mt: 2, mb: 2 }} />
                <Box display="flex" justifyContent="space-between" alignItems="center">
                    <Box margin="normal">
                        <TextField
                            fullWidth
                            margin="normal"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            sx={{
                                maxWidth: '300px',
                                '& fieldset': editMode.title ? { outline: 'initial' } : { border: 'none' },
                                '& input': {
                                    fontWeight: 'bold',
                                    fontSize: '1.2rem',
                                },
                                '&:hover': {
                                    backgroundColor: '#f0f0f0',
                                },
                            }}
                            slotProps={{
                                input: {
                                    readOnly: !editMode.title,
                                },
                            }}
                            onClick={() => handleClick('title')}
                        />
                    </Box>

                    <Box display="flex" alignItems="center" margin="normal">
                        <Typography variant="body1" fontWeight="bold" sx={{ marginRight: 1 }}>
                            Status:
                        </Typography>
                        <Typography variant="body1">{selectedTask?.status.toUpperCase()}</Typography>
                    </Box>
                </Box>

                <Box p={1}>
                    <Box>
                        <Typography variant="body1" fontWeight="bold" m={1}>Description</Typography>
                        <Box onClick={() => handleClick('description')}>
                            {editMode.description && (
                                <ReactQuill
                                    value={description}
                                    onChange={setDescription}
                                    style={{
                                        marginBottom: '3rem',
                                        height: 'auto',
                                        minHeight: '350px',
                                        overflowY: 'auto',
                                    }}
                                />

                            )}
                            {!editMode.description && (
                                <ReactQuill
                                    value={description}
                                    style={{
                                        marginBottom: '3rem',
                                        height: 'auto',
                                        minHeight: '350px',
                                        overflowY: 'auto',
                                        outline: 'none !important',
                                        border: '100px solid #ccc',
                                    }}
                                    readOnly={true}
                                    theme="snow"
                                    modules={{ toolbar: false }}
                                />
                            )}
                        </Box>
                    </Box>

                    <Box display="flex" flexWrap="wrap" flexDirection="row" gap={2}>
                        <Box flex={1} minWidth="200px" onClick={() => handleClick('priority')}>
                            <FormControl fullWidth margin="normal">
                                <InputLabel shrink>Priority</InputLabel>
                                <Select
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                                    label="Priority"
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0',
                                            cursor: 'pointer',
                                        },
                                    }}
                                >
                                    <MenuItem value="low">Low</MenuItem>
                                    <MenuItem value="medium">Medium</MenuItem>
                                    <MenuItem value="high">High</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>

                        <Box flex={1} minWidth="200px">
                            <FormControl fullWidth margin="normal" onClick={() => handleClick('assignedTo')}>
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
                                                maxHeight: 200,
                                                overflowY: 'auto',
                                            },
                                        },
                                    }}
                                    sx={{
                                        '&:hover': {
                                            backgroundColor: '#f0f0f0',
                                            cursor: 'pointer',
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

                <Divider sx={{ mt: 2, mb: 2 }} />
                {
                    (editMode.title || editMode.description || editMode.priority || editMode.assignedTo) && (
                        <Button variant="contained" onClick={handleUpdate} sx={{ mt: 2 }}>
                            Save Changes
                        </Button>
                    )
                }
                <Button onClick={handleClose} sx={{ mt: 2 }}>
                    Close
                </Button>
            </Box >
        </Container>
    );
};

export default TaskDetail;
