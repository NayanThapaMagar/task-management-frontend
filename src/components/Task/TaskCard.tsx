import React from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { Task } from '../../types';
import { MoreHoriz } from '@mui/icons-material';
import useTaskCard from '../../hooks/task/useTaskCard';

interface TaskCardProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
  draggedTaskStatus: string;
  onTaskDragStart: (e: React.DragEvent<HTMLElement>, task: Task, currentStatus: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ tasks, onTaskClick, draggedTaskStatus, onTaskDragStart }) => {
  const {
    getPriorityColor,
    handleTaskMenuClose,
    handleTaskMenuClick,
    setCurrentTaskOnMenu,
    anchorEl,
    handleDeleteTask,
  } = useTaskCard();



  return (
    <Box width="100%">
      {tasks.map((task) => (
        <Box
          key={task._id}
          draggable
          onDragStart={(e) => onTaskDragStart(e, task, draggedTaskStatus)}
          onClick={() => onTaskClick(task)}
          sx={{
            cursor: 'pointer',
            padding: 1,
            marginBottom: 0.3,
            border: '1px solid #ccc',
            backgroundColor: 'background.paper',
            transition: 'transform 0.1s, opacity 0.1s',
            '&:hover': {
              backgroundColor: 'grey.100',
              boxShadow: 3,
              transform: 'scale(1.02)',
            },
            '&:active': {
              cursor: 'grabbing',
              opacity: 0.95,
              boxShadow: 5,
            },
          }}
          aria-label={`Task titled ${task.title} with priority ${task.priority}`}
        >
          <Box sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <Typography sx={{
              flexGrow: 1,
              fontWeight: '500',
              fontSize: '1rem',
            }}>{task.title}</Typography>
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
              <MenuItem onClick={handleDeleteTask}>Delete</MenuItem>
            </Menu>
          </Box>
          <Typography sx={{
            fontWeight: '500',
            fontSize: '0.8rem',
          }}>
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

export default TaskCard;
