import React from 'react';
import { Box, Typography, Divider, Avatar, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';

interface CommentCardProps {
//   username: string;
  content: string;
  timestamp: string;
  onDelete: () => void; 
}
const username = "Hari sub";
const CommentCard: React.FC<CommentCardProps> = ({ content, timestamp, onDelete }) => {
  return (
    <Box sx={{ border: '1px solid #ccc', borderRadius: 2, p: 2, mb: 2, backgroundColor: 'background.paper' }}>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        <Avatar sx={{ mr: 2 }} />
        <Typography variant="body1" fontWeight="bold">{username}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ ml: 'auto' }}>{timestamp}</Typography>
      </Box>
      <Typography variant="body2" sx={{ mb: 2 }}>{content}</Typography>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
        <IconButton color="error" onClick={onDelete}>
          <Delete />
        </IconButton>
      </Box>
    </Box>
  );
};

export default CommentCard;
