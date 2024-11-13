import React from 'react';
import {
    Container,
    Box,
    Snackbar,
    Alert,
    Button,
    CircularProgress,
    FormControl,
    FormControlLabel,
    FormLabel,
    InputLabel,
    MenuItem,
    Radio,
    RadioGroup,
    Select,
    TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import TaskCard from '../../components/Task/TaskCard';
import useTaskList from '../../hooks/useTaskList';

const Task: React.FC = () => {
    const {
        groupedTasks,
        handleTaskClick,
        priorityFilter,
        handlePriorityFilterChange,
        view,
        handleViewChange,
        search,
        handleSearchChange,
        loading,
        success,
        error,
        openSnackbar,
        handleSnackbarClose,
    } = useTaskList();

    const navigate = useNavigate();

    return (
        <Container>
            <Box sx={{ p: 3, mt: 2 }}>
                <Box mb={3}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        value={search}
                        onChange={handleSearchChange}
                        margin="normal"
                    />
                </Box>
                <Box display="flex" justifyContent="space-between" mb={10}>
                    <FormControl fullWidth margin="normal">
                        <FormLabel>View Tasks</FormLabel>
                        <RadioGroup row value={view} onChange={handleViewChange}>
                            <FormControlLabel value="all" control={<Radio />} label="All Tasks" />
                            <FormControlLabel value="myTasks" control={<Radio />} label="My Tasks" />
                            <FormControlLabel value="assignedTasks" control={<Radio />} label="Assigned Tasks" />
                        </RadioGroup>
                    </FormControl>
                    <FormControl variant="outlined" style={{ width: '150px' }} margin="normal">
                        <InputLabel>Priority</InputLabel>
                        <Select
                            value={priorityFilter}
                            onChange={handlePriorityFilterChange}
                            label="Priority"
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="low">Low</MenuItem>
                        </Select>
                    </FormControl>
                </Box>

                {loading ? (
                    <CircularProgress />
                ) : (
                    <Box
                        gap={2}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            overflowX: 'auto',
                            flexWrap: 'nowrap',
                            p: 1,
                        }}
                    >
                        {Object.entries(groupedTasks).map(([status, tasks]) => (
                            <Box
                                key={status}
                                sx={{
                                    padding: 1,
                                    margin: 1,
                                    border: '1px solid #ccc',
                                    borderRadius: '8px',
                                    boxShadow: 2,
                                    backgroundColor: 'background.paper',
                                    minWidth: '250px',
                                    minHeight: '150px',
                                }}
                            >
                                <Box mb={2}>
                                    <h3>{status}</h3>
                                    <TaskCard tasks={tasks} onTaskClick={handleTaskClick} />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
                <br />

                <Button variant='contained' onClick={() => navigate('/tasks/addTask')}>Add Task</Button>

            </Box>

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

export default Task;
