import React, { useEffect, useState } from 'react';
import {
    Container,
    Box,
    Button,
    Grid,
    TextField,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
    Snackbar,
    Alert,
    SelectChangeEvent,
} from '@mui/material';
import { Task as TaskType } from '../types';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllTasks, selectTasks } from '../features/taskSlice';
import TaskDetailModal from '../components/Task/TaskDetailModal';
import AddTaskModal from '../components/Task/AddTaskModal';
import TaskCard from '../components/Task/TaskCard';
import TaskList from '../components/Task/TaskList';
import { AppDispatch } from '../store';

const Task: React.FC = () => {
    const dispatch = useDispatch<AppDispatch>();
    const tasks = useSelector(selectTasks);

    const [search, setSearch] = useState('');
    const [filter, setFilter] = useState('all');
    const [priorityFilter, setPriorityFilter] = useState('all');  
    const [sortBy, setSortBy] = useState('createdAt');
    const [view, setView] = useState('card');
    const [cardTasks, setCardTasks] = useState<TaskType[]>([]);
    const [listTasks, setListTasks] = useState<TaskType[]>([]);
    const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
    const [openDetailModal, setOpenDetailModal] = useState(false);
    const [openAddTaskModal, setOpenAddTaskModal] = useState(false);
    const [loading, setLoading] = useState(true);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackOpen, setSnackOpen] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const query: Record<string, string> = {};
        if (filter !== 'all') query.status = filter;
        if (priorityFilter !== 'all') query.priority = priorityFilter;

        await dispatch(fetchAllTasks({ ...query, page: 1, limit: 10 }));
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
    }, [filter, priorityFilter, dispatch]);

    useEffect(() => {
        const filteredTasks = tasks.filter((task) => {
            const matchesSearch = task.title.toLowerCase().includes(search.toLowerCase());
            return matchesSearch;
        });

        const sortedTasks = filteredTasks.sort((a, b) => {
            if (sortBy === 'createdAt') {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            }
            if (sortBy === 'priority') {
                return a.priority.localeCompare(b.priority);
            }
            return 0;
        });

        if (view === 'card') {
            setCardTasks(sortedTasks);
        } else {
            setListTasks(sortedTasks);
        }
    }, [tasks, search, sortBy, view]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearch(e.target.value);
    };

    const handleFilterChange = (e: SelectChangeEvent<string>) => {
        setFilter(e.target.value);
    };

    const handlePriorityFilterChange = (e: SelectChangeEvent<string>) => {
        setPriorityFilter(e.target.value);
    };

    const handleSortChange = (e: SelectChangeEvent<string>) => {
        setSortBy(e.target.value);
    };

    const handleViewChange = (view: string) => {
        setView(view);
    };

    const handleTaskClick = (task: TaskType) => {
        setSelectedTask(task);
        setOpenDetailModal(true);
    };

    const handleCloseSnackbar = () => {
        setSnackOpen(false);
    };

    const handleAddTask = () => {
        setOpenAddTaskModal(true);
    };

    return (
        <Container>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <TextField
                    variant="outlined"
                    label="Search Tasks"
                    value={search}
                    onChange={handleSearchChange}
                    style={{ flex: 1, marginRight: 16 }}
                />
            </Box>
            <Box display="flex" justifyContent="space-between" mb={2}>
                <FormControl variant="outlined" style={{ width: '150px' }}>
                    <InputLabel>Status</InputLabel>
                    <Select value={filter} onChange={handleFilterChange}>
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="completed">Completed</MenuItem>
                        <MenuItem value="pending">Pending</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" style={{ width: '150px' }}>
                    <InputLabel>Priority</InputLabel>
                    <Select value={priorityFilter} onChange={handlePriorityFilterChange}>
                        <MenuItem value="all">All</MenuItem>
                        <MenuItem value="high">High</MenuItem>
                        <MenuItem value="medium">Medium</MenuItem>
                        <MenuItem value="low">Low</MenuItem>
                    </Select>
                </FormControl>
                <FormControl variant="outlined" style={{ width: '150px' }}>
                    <InputLabel>Sort By</InputLabel>
                    <Select value={sortBy} onChange={handleSortChange}>
                        <MenuItem value="createdAt">Creation Date</MenuItem>
                        <MenuItem value="priority">Priority</MenuItem>
                    </Select>
                </FormControl>
                <Box>
                    <Button
                        variant={view === 'card' ? 'contained' : 'outlined'}
                        onClick={() => handleViewChange('card')}
                    >
                        Card View
                    </Button>
                    <Button
                        variant={view === 'list' ? 'contained' : 'outlined'}
                        onClick={() => handleViewChange('list')}
                    >
                        List View
                    </Button>
                </Box>
            </Box>

            {loading ? (
                <CircularProgress />
            ) : (
                <Grid container spacing={2}>
                    {view === 'card'
                        ? cardTasks.map((task) => (
                              <Grid item xs={12} sm={6} md={4} key={task._id}>
                                  <TaskCard task={task} onClick={handleTaskClick} />
                              </Grid>
                          ))
                        : <TaskList tasks={listTasks} onTaskClick={handleTaskClick} />}
                </Grid>
            )}

            <TaskDetailModal
                open={openDetailModal}
                onClose={() => setOpenDetailModal(false)}
                task={selectedTask}
                onSnackOpen={() => {
                    setSnackMessage('Task updated successfully!');
                    setSnackOpen(true);
                }}
            />
            <AddTaskModal
                open={openAddTaskModal}
                onClose={() => setOpenAddTaskModal(false)}
                onSnackOpen={() => {
                    setSnackMessage('Task added successfully!');
                    setSnackOpen(true);
                }}
            />
            <Snackbar open={snackOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {snackMessage}
                </Alert>
            </Snackbar>
            <Button variant="contained" onClick={handleAddTask}>
                Add Task
            </Button>
        </Container>
    );
};

export default Task;
