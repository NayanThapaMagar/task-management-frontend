import React from 'react';
import {
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
import useTaskList from '../../hooks/task/useTaskList';

const Task: React.FC = () => {
    const {
        groupedTasks,
        handleTaskClick,
        taskPriorityFilter,
        handleTaskPriorityFilterChange,
        taskCategory,
        handleTaskCategoryChange,
        search,
        handleSearchChange,
        handleDragTaskStart,
        handleDragTaskOver,
        handleDropTask,
        isTasksAtScrollTop,
        handleScroll,
        loading,
        success,
        error,
        openSnackbar,
        handleSnackbarClose,
    } = useTaskList();

    const navigate = useNavigate();

    return (
        <Box
            sx={{
                overflow: 'auto',
                maxHeight: 'calc(100vh - 66px)',
                maxWidth: 'calc(100vw - 57px)',
            }}
        >
            <Box sx={{ p: 2, mt: 2 }}>
                <Typography variant="h5">Task List</Typography>
                <Divider sx={{ mt: 0, mb: 2 }} />
                <Box sx={{
                    marginBottom: 3,
                }}>
                    <TextField
                        label="Search"
                        variant="outlined"
                        fullWidth
                        value={search}
                        onChange={handleSearchChange}
                        sx={{
                            padding: 0,
                            margin: 0,
                        }}
                    />
                </Box>


                <Box display="flex" justifyContent="space-between" mb={3}>
                    <FormControl fullWidth margin="none">
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
                            value={taskPriorityFilter}
                            onChange={handleTaskPriorityFilterChange}
                            label="Priority"
                        >
                            <MenuItem value="all">All</MenuItem>
                            <MenuItem value="high">High</MenuItem>
                            <MenuItem value="medium">Medium</MenuItem>
                            <MenuItem value="low">Low</MenuItem>
                        </Select>
                    </FormControl>
                </Box>
                {/* 
                {loading ? (
                    <CircularProgress />
                ) : ( */}
                <Box
                    sx={{
                        maxHeight: '44vh',
                        overflowY: 'auto',
                        paddingRight: '16px',
                    }}
                    onScroll={handleScroll}
                >
                    <Box
                        gap={0.3}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            flexWrap: 'nowrap',
                        }}
                    >
                        {Object.entries(groupedTasks).map(([status, tasks]) => (
                            <Box
                                key={status}
                                onDragOver={handleDragTaskOver}
                                onDrop={(e) => handleDropTask(e, status)}
                                sx={{
                                    padding: 0,
                                    margin: 0,
                                    backgroundColor: 'grey.100',
                                    minWidth: '150px',
                                    flexGrow: 1,
                                    flexBasis: 0,
                                    '&:hover': {
                                        borderColor: 'currentcolor',
                                    },
                                }}
                            >
                                <Box sx={{
                                    height: '100%',
                                }}>
                                    <Box
                                        className="status-header"
                                        sx={{
                                            padding: '6px',
                                            textAlign: 'center',
                                            position: 'sticky',
                                            top: 0,
                                            zIndex: 1,
                                            backgroundColor: 'grey.100',
                                            transition: 'box-shadow 0.3s ease',
                                            borderBottom: !isTasksAtScrollTop ? '1px solid #ccc' : 'none',
                                        }}
                                    >
                                        <h3
                                            style={{
                                                margin: 0,
                                                fontWeight: '500',
                                                fontSize: '1rem',
                                            }}
                                        >
                                            {status.toLocaleUpperCase()}
                                        </h3>
                                    </Box>
                                    <Box
                                        sx={{
                                            minHeight: '300px',
                                            padding: 0.3,
                                            paddingBottom: 0,
                                            paddingTop: 0,
                                        }}
                                    >
                                        <TaskCard
                                            tasks={tasks}
                                            onTaskClick={handleTaskClick}
                                            draggedTaskStatus={status}
                                            onTaskDragStart={handleDragTaskStart}
                                        />
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </Box>
                </Box>

                {/* // )} */}

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
        </Box>
    );
};

export default Task;
