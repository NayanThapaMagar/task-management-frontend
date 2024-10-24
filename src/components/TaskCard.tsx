import React from 'react';
import { Card, CardContent, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface TaskCardProps {
  task: any;
}

const TaskCard: React.FC<TaskCardProps> = ({ task }) => {
  const navigate = useNavigate();

  const handleViewTask = () => {
    navigate(`/task/${task._id}`);
  };

  return (
    <Card>
      <CardContent>
        <Typography variant="h5">{task.title}</Typography>
        <Typography>{task.description}</Typography>
        <Button onClick={handleViewTask}>View Task</Button>
      </CardContent>
    </Card>
  );
};

export default TaskCard;
