import React from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { Task } from '../../types';
import { MoreHoriz } from '@mui/icons-material';
import { useDispatch } from 'react-redux';
import { deleteTask } from '../../features/taskSlice';
import { AppDispatch } from '../../store';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

const getPriorityColor = (priority: 'low' | 'medium' | 'high'): string => {
  switch (priority) {
    case 'high':
      return '#ff0000';
    case 'medium':
      return '#ffa500';
    case 'low':
      return '#00b300';
  }
};

const TaskList: React.FC<TaskListProps> = ({ tasks, onTaskClick }) => {

  const dispatch = useDispatch<AppDispatch>();

  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [currentTaskOnMenu, setCurrentTaskOnMenu] = React.useState<Task | null>(null);

  const handleTaskMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleTaskMenuClose = (event: React.MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setCurrentTaskOnMenu(null)
    setAnchorEl(null);
  };

  const handleDeleteTask = async () => {
    const taskId = currentTaskOnMenu?._id
    if (taskId) {
      await dispatch(deleteTask(taskId));
      setCurrentTaskOnMenu(null)
    }

  }

  return (
    <Box width="100%">
      {tasks.map((task) => (
        <Box
          key={task._id}
          border={1}
          borderColor="grey.300"
          borderRadius={2}
          padding={2}
          marginBottom={2}
          onClick={() => onTaskClick(task)}
          sx={{
            cursor: 'pointer',
            '&:hover': { backgroundColor: 'grey.100' },
          }}
          aria-label={`Task titled ${task.title} with priority ${task.priority}`}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography variant="h6">{task.title}</Typography>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentTaskOnMenu(task)
                handleTaskMenuClick(e);
              }}
            >
              <MoreHoriz />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleTaskMenuClose}
              onClick={handleTaskMenuClose}
            >
              <MenuItem onClick={() => handleDeleteTask()}>Delete</MenuItem>
            </Menu>
          </Box>
          <Typography variant="body1">
            Priority:
            <span
              style={{
                color: getPriorityColor(task.priority),
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {task.priority}
            </span>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TaskList;
