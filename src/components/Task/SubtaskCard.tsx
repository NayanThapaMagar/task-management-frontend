import React from 'react';
import { Box, Typography, IconButton, Menu, MenuItem } from '@mui/material';
import { SubTask } from '../../types';
import { MoreHoriz } from '@mui/icons-material';
import useSubtaskCard from '../../hooks/subtask/useSubtaskCard';

interface SubtaskCardProps {
  taskId: string;
  subtasks: SubTask[];
  onSubtaskClick: (subtask: SubTask) => void;
  draggedSubtaskStatus: string;
  onSubtaskDragStart: (e: React.DragEvent<HTMLElement>, subtask: SubTask, currentStatus: string) => void;
}

const SubtaskCard: React.FC<SubtaskCardProps> = ({ taskId, subtasks, onSubtaskClick, draggedSubtaskStatus, onSubtaskDragStart }) => {
  const {
    getPriorityColor,
    handleSubtaskMenuClose,
    handleSubtaskMenuClick,
    setCurrentSubtaskOnMenu,
    anchorEl,
    handleDeleteSubtask,
  } = useSubtaskCard();



  return (
    <Box width="100%">
      {subtasks.map((subtask) => (
        <Box
          key={subtask._id}
          draggable
          onDragStart={(e) => onSubtaskDragStart(e, subtask, draggedSubtaskStatus)}
          onClick={() => onSubtaskClick(subtask)}
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
              opacity: 0.9,
              boxShadow: 5,
            },
          }}
          aria-label={`SubTask titled ${subtask.title} with priority ${subtask.priority}`}
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
            }}>{subtask.title}</Typography>
            <IconButton
              aria-label="more"
              aria-controls="long-menu"
              aria-haspopup="true"
              onClick={(e) => {
                e.stopPropagation();
                setCurrentSubtaskOnMenu(subtask)
                handleSubtaskMenuClick(e);
              }}
            >
              <MoreHoriz />
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleSubtaskMenuClose}
              onClick={handleSubtaskMenuClose}
            >
              <MenuItem onClick={() => handleDeleteSubtask(taskId)}>Delete</MenuItem>
            </Menu>
          </Box>
          <Typography sx={{
            fontWeight: '500',
            fontSize: '0.8rem',
          }}>
            Priority:
            <span
              style={{
                color: getPriorityColor(subtask.priority),
                fontWeight: 'bold',
                padding: '2px 6px',
                borderRadius: '4px',
              }}
            >
              {subtask.priority}
            </span>
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default SubtaskCard;
