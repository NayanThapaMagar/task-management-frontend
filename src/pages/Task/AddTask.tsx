import React from 'react';
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
    Container,
    CircularProgress,
    Alert,
    Snackbar
} from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useAddTask from '../../hooks/useAddTask';
import { useNavigate } from 'react-router-dom';

const AddTask: React.FC = () => {
    const {
        title,
        setTitle,
        description,
        setDescription,
        priority,
        setPriority,
        assignedTo,
        allConnections,
        loading,
        success,
        error,
        openSnackbar,
        handleSubmit,
        handleAssignedToChange,
        handleSnackbarClose
    } = useAddTask();

    const navigate = useNavigate();

    return (
        <Container>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                    <CircularProgress />
                </Box>
            ) : (
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
                                <ReactQuill
                                    value={description}
                                    onChange={setDescription}
                                    style={{ marginBottom: '3rem', height: '250px' }}
                                />
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
                                                        maxHeight: 200,
                                                        overflowY: 'auto',
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
                        <Button onClick={() => navigate('/tasks')} sx={{ mt: 2 }}>
                            Close
                        </Button>
                    </form>
                </Box>
            )}

            {(success || error) && (
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={handleSnackbarClose} severity={success ? 'success' : 'error'}>
                        {success || error}
                    </Alert>
                </Snackbar>
            )}
        </Container>
    );
};

export default AddTask;
