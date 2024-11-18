import React from 'react';
import { Box, Typography, Avatar, Button, TextField } from '@mui/material';
import { Comment, User } from '../../types';
import { getInitials } from '../../utils';
import useCommentCard from '../../hooks/comment/useCommentCard';

interface CommentCardProps {
  comments: Comment[];
  taskId: string;
  subtaskId: string | null;
}

const CommentCard: React.FC<CommentCardProps> = ({ comments, taskId, subtaskId }) => {
  const {
    editModeId,
    timeStamp,
    toggleTimestampFormat,
    handleEdit,
    handleCancel,
    commentText,
    handleCommentChange,
    handleCommentSubmit,
    handleDelete,
  } = useCommentCard();

  return (
    <Box width="100%">
      {comments.map((comment) => (
        <Box
          key={comment._id}
          sx={{ p: 1, mt: 1 }}
        >
          <Box display={'flex'} flexDirection={'row'}>
            <Box sx={{ display: 'flex', mb: 2 }}>
              <Avatar sx={{ backgroundColor: 'darkcyan', width: 40, height: 40, mr: 2 }}>
                {getInitials((comment.userId as User).username)}
              </Avatar>
            </Box>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-start', alignItems: 'center' }}>
                  <Typography variant="body1" sx={{
                    fontFamily: "Roboto, Arial, sans-serif",
                    fontWeight: 540,
                    fontSize: "1.1rem",
                  }}
                  >{(comment.userId as User).username.toLocaleUpperCase()}</Typography>
                  <Button
                    onClick={toggleTimestampFormat}
                    disableRipple
                    sx={{
                      all: "unset",
                      cursor: "pointer",
                    }}
                  >
                    < Typography variant="body1" color="text.secondary" sx={{ ml: 2 }}>{timeStamp(comment.createdAt, comment.updatedAt).timeString}</Typography>
                  </Button>
                  {timeStamp(comment.createdAt, comment.updatedAt).isEdited && <Typography variant="body1" color="text.secondary" sx={{ ml: 2 }}>Edited</Typography>}
                </Box>
                {(editModeId !== comment._id)
                  &&
                  <Typography variant="body2" sx={{
                    fontFamily: "Roboto, Arial, sans-serif",
                    fontWeight: 400,
                    fontSize: "0.875rem",
                    color: "text.primary",
                    whiteSpace: "pre-wrap",
                    wordBreak: "break-word",
                    overflowWrap: "break-word",
                    lineHeight: 1.5,
                  }}
                  >{comment.text}</Typography>}
              </Box>

              {editModeId === comment._id ? (
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                  <TextField
                    fullWidth
                    required
                    multiline
                    placeholder="Add a comment..."
                    value={commentText}
                    onChange={handleCommentChange}
                    sx={{ mb: 2 }}
                  />
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => handleCommentSubmit(taskId, subtaskId, comment._id)}
                      disabled={!commentText.trim()}
                      sx={{ padding: '6px 12px', fontSize: '0.875rem' }}
                    >
                      Submit
                    </Button>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={handleCancel}
                      sx={{ padding: '6px 12px', fontSize: '0.875rem' }}
                    >
                      Cancel
                    </Button>
                  </Box>
                </Box>
              ) : (<Box sx={{ display: "flex", justifyContent: "flex-start", gap: 1 }}>
                <Button
                  onClick={() => handleEdit(comment._id, comment.text)}
                  disableRipple
                  sx={{
                    all: "unset",
                    cursor: "pointer",
                    color: "text.primary",
                    fontFamily: "Roboto, Arial, sans-serif",
                    fontWeight: 540,
                    fontSize: "0.9rem",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleDelete(taskId, subtaskId, comment._id)}
                  disableRipple
                  sx={{
                    all: "unset",
                    cursor: "pointer",
                    color: "text.primary",
                    fontFamily: "Roboto, Arial, sans-serif",
                    fontWeight: 540,
                    fontSize: "0.9rem",
                    "&:hover": {
                      textDecoration: "underline",
                    },
                  }}
                >
                  Delete
                </Button>
              </Box>)}
            </Box>
          </Box>
        </Box>
      ))
      }
    </Box >
  );
};

export default CommentCard;
