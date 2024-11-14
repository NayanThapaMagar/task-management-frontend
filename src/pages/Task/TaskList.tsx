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
    Divider,
    Typography,
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
        taskCategory,
        handleTaskCategoryChange,
        search,
        handleSearchChange,
        handleDragStart,
        handleDragOver,
        handleDrop,
        loading,
        success,
        error,
        openSnackbar,
        handleSnackbarClose,
    } = useTaskList();

    const navigate = useNavigate();

    return (
        <Container>
            <Box sx={{ p: 2, mt: 2 }}>
                <Typography variant="h5">Task List</Typography>
                <Divider sx={{ mt: 2, mb: 2 }} />
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
                        <RadioGroup row value={taskCategory} onChange={handleTaskCategoryChange}>
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
                                onDragOver={handleDragOver}
                                onDrop={(e) => handleDrop(e, status)}
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
                                    <TaskCard tasks={tasks} onTaskClick={handleTaskClick} draggedTaskStatus={status} onTaskDragStart={handleDragStart} />
                                </Box>
                            </Box>
                        ))}
                    </Box>
                )}
                <br />

                <Button
                    variant="contained"
                    onClick={() => navigate('/tasks/addTask')}
                    sx={{
                        px: 4,
                        py: 1.5,
                        fontWeight: 'bold',
                        borderRadius: 2,
                        backgroundColor: 'primary.main',
                        color: 'white',
                        boxShadow: 2,
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                            boxShadow: 3,
                        },
                        mt: 2,
                    }}
                >
                    Add Task
                </Button>


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
