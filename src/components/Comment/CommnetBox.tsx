import React from 'react';
import { TextField, Button, Box, Avatar } from '@mui/material';
import useCommentBox from '../../hooks/comment/useCommentBox';

interface CommentBoxProps {
    taskId: string;
    subtaskId: string | null;
}

const CommentBox: React.FC<CommentBoxProps> = ({ taskId, subtaskId }) => {
    const {
        getInitials,
        username,
        isTextFieldFocused,
        setIsTextFieldFocused,
        comment,
        handleCommentChange,
        handleCommentSubmit,
        handleCancel,
    } = useCommentBox();


    return (
        <Box sx={{ p: 1, mt: 2, pb: 0 }}>
            <Box display={'flex'} flexDirection={'row'}>
                <Box sx={{ display: 'flex', mb: 2 }}>
                    <Avatar sx={{ backgroundColor: 'darkcyan', width: 40, height: 40, mr: 2 }}>
                        {getInitials(username)}
                    </Avatar>
                </Box>
                <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column' }}>
                    <TextField
                        fullWidth
                        required
                        multiline
                        rows={isTextFieldFocused ? 6 : 2}
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={handleCommentChange}
                        onFocus={() => setIsTextFieldFocused(true)}
                        sx={{ mb: 2 }}
                    />
                    {isTextFieldFocused && <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => handleCommentSubmit(taskId, subtaskId)}
                            disabled={!comment.trim()}
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
                    </Box>}
                </Box>
            </Box>
        </Box>
    );
};

export default CommentBox;
