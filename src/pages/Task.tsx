import React, { useState } from 'react';
import {
    Container,
    Box,
    Snackbar,
    Alert,
} from '@mui/material';
import { Task as TaskType } from '../types';
import TaskDetailModal from '../components/Task/TaskDetailModal';
import AddTaskModal from '../components/Task/AddTaskModal';
import TaskListModal from '../components/Task/TaskListModal';

const Task: React.FC = () => {
    const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
    const [snackMessage, setSnackMessage] = useState('');
    const [snackOpen, setSnackOpen] = useState(false);
    const [activeView, setActiveView] = useState<'list' | 'addTask' | 'detail'>('list');

    const handleTaskClick = (task: TaskType) => {
        setSelectedTask(task);
        setActiveView('detail');
    };

    const handleAddTask = () => {
        setActiveView('addTask');
    };

    const handleCloseModal = () => {
        setActiveView('list');
        setSelectedTask(null);
    };

    const handleCloseSnackbar = () => {
        setSnackOpen(false);
    };

    return (
        <Container>
            <Box sx={{ p: 3, mt: 2 }}>
                {activeView === 'list' && (
                    <TaskListModal
                        onTaskClick={handleTaskClick}
                        onAddTaskClick={handleAddTask}
                    />
                )}

                {activeView === 'addTask' && (
                    <AddTaskModal
                        open={activeView === 'addTask'}
                        onClose={handleCloseModal}
                        onSnackOpen={() => {
                            setSnackMessage('Task added successfully!');
                            setSnackOpen(true);
                        }}
                    />
                )}

                {activeView === 'detail' && selectedTask && (
                    <TaskDetailModal
                        open={activeView === 'detail'}
                        onClose={handleCloseModal}
                        task={selectedTask}
                        onSnackOpen={() => {
                            setSnackMessage('Task updated successfully!');
                            setSnackOpen(true);
                        }}
                    />
                )}
            </Box>

            <Snackbar open={snackOpen} autoHideDuration={3000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity="success">
                    {snackMessage}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Task;
