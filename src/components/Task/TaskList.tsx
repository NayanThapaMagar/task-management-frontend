import React from 'react';
import { Box, Typography } from '@mui/material';
import { Task } from '../../types';

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
          <Typography variant="h6">{task.title}</Typography>
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
