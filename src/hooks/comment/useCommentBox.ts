import React, { useState } from 'react';
import { AppDispatch, RootState } from '../../store';
import { useDispatch, useSelector } from 'react-redux';
import { addSubtaskComment } from '../../features/subtaskSlice';
import { addTaskComment } from '../../features/taskSlice';
import { getInitials } from '../../utils/index'

const useCommentBox = () => {

    const dispatch = useDispatch<AppDispatch>();
    const { user } = useSelector((state: RootState) => state.auth);

    const username = user.username;

    const [comment, setComment] = useState('');
    const [isTextFieldFocused, setIsTextFieldFocused] = useState(false);

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setComment(e.target.value);
    };

    const handleCommentSubmit = async (taskId: string, subtaskId: string | null) => {
        if (taskId && subtaskId && comment) {
            await dispatch(addSubtaskComment({ taskId, subtaskId, text: comment.trim() }))
        } else if (taskId && !subtaskId && comment) {
            await dispatch(addTaskComment({ taskId, text: comment.trim() }))
        }
        setComment('');
    };

    const handleCancel = () => {
        setIsTextFieldFocused(false)
        setComment('');
    };

    return {
        getInitials,
        username,
        isTextFieldFocused,
        setIsTextFieldFocused,
        comment,
        handleCommentChange,
        handleCommentSubmit,
        handleCancel,
    }

}

export default useCommentBox;