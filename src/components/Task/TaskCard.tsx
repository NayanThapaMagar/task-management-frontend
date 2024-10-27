import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import dayjs from 'dayjs';
import { Task } from '../../types';

interface TaskCardProps {
  task: Task;
  onClick: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onClick }) => {
  return (
    <Card onClick={() => onClick(task)} style={{ cursor: 'pointer' }}>
      <CardContent>
        <Typography variant="h6">{task.title}</Typography>
        <Typography color="textSecondary">Priority: {task.priority}</Typography>
        <Typography color="textSecondary">Status: {task.status}</Typography>
        <Typography color="textSecondary">
          Created At: {dayjs(task.createdAt).format('MMMM D, YYYY h:mm A')}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
