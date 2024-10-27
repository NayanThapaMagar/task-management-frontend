import React from 'react';
import { Box, Typography } from '@mui/material';
import { Task } from '../../types';
import dayjs from 'dayjs';

interface TaskListProps {
  tasks: Task[];
  onTaskClick: (task: Task) => void;
}

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
          style={{ cursor: 'pointer' }}
        >
          <Typography variant="h6">{task.title}</Typography>
          <Typography color="textSecondary">Priority: {task.priority}</Typography>
          <Typography color="textSecondary">Status: {task.status}</Typography>
          <Typography color="textSecondary">
            Created At: {dayjs(task.createdAt).format('MMMM D, YYYY h:mm A')}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default TaskList;
