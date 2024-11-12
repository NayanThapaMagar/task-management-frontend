import React, { useEffect, useState } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    SelectChangeEvent,
    TextField,
    Grid,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormLabel,
} from '@mui/material';
import { Task as TaskType } from '../../types';
import TaskList from './TaskCard';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTasks, fetchMyTasks, fetchAssignedTasks, selectAllTasks, selectMyTasks, selectAssignedTasks } from '../../features/taskSlice';
import { AppDispatch } from '../../store';

interface TaskListModalProps {
    onTaskClick: (task: TaskType) => void;
    onAddTaskClick: () => void;
}

const TaskListModal: React.FC<TaskListModalProps> = ({ onTaskClick, onAddTaskClick }) => {
    const dispatch = useDispatch<AppDispatch>();
    const allTasks = useSelector(selectAllTasks);
    const myTasks = useSelector(selectMyTasks);
    const assignedTasks = useSelector(selectAssignedTasks);

    const [search, setSearch] = useState('');
    const [priorityFilter, setPriorityFilter] = useState('all');
    const [listTasks, setListTasks] = useState<TaskType[]>([]);
    const [loading, setLoading] = useState(true);
    const [view, setView] = useState('all');

    const fetchData = async () => {
        setLoading(true);
        const query: Record<string, string> = {};
        if (priorityFilter !== 'all') query.priority = priorityFilter;

        if (view === 'all') {
            await dispatch(fetchAllTasks({ ...query, page: 1, limit: 10 }));
        } else if (view === 'myTasks') {
            await dispatch(fetchMyTasks({ ...query, page: 1, limit: 10 }));
        } else if (view === 'assignedTasks') {
            await dispatch(fetchAssignedTasks({ ...query, page: 1, limit: 10 }));
        }

        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [priorityFilter, view, dispatch]);

    useEffect(() => {
        // Filter tasks based on the search term
        const tasks = view === 'all' ? allTasks : view === 'myTasks' ? myTasks : assignedTasks;
        const filteredTasks = tasks.filter((task) => task.title.toLowerCase().includes(search.toLowerCase()));
        setListTasks(filteredTasks);
    }, [allTasks, myTasks, assignedTasks, search, view]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handlePriorityFilterChange = (e: SelectChangeEvent<string>) => {
        setPriorityFilter(e.target.value);
    };

    const handleViewChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setView(e.target.value);
    };

    // Group tasks by their status
    const groupedTasks = {
        'To Do': listTasks.filter((task) => task.status === 'to do'),
        'Pending': listTasks.filter((task) => task.status === 'pending'),
        'Completed': listTasks.filter((task) => task.status === 'completed'),
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" mb={3}>
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
                <Grid
                    container
                    spacing={2}
                    sx={{
                        display: 'flex',
                        flexDirection: 'row',
                        overflowX: 'auto',
                        flexWrap: 'nowrap',
                        justifyContent: 'center', 
                    }}
                >
                    {Object.entries(groupedTasks).map(([status, tasks]) => (
                        <Grid
                            key={status}
                            item
                            sx={{
                                padding: 1,
                                margin: 1,
                                border: '1px solid #ccc',
                                borderRadius: '8px',
                                boxShadow: 2,
                                backgroundColor: 'background.paper',
                                minWidth: '300px',
                            }}
                        >
                            <Box mb={2}>
                                <h3>{status}</h3>
                                <TaskList tasks={tasks} onTaskClick={onTaskClick} />
                            </Box>
                        </Grid>
                    ))}
                </Grid>
            )}
            <br />

            <Button variant='contained' onClick={onAddTaskClick}>Add Task</Button>
        </Box>
    );
};

export default TaskListModal;
