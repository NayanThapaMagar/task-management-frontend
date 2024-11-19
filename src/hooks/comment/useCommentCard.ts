import { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../store";
import { timeAgo, formatDateTime } from '../../utils';
import { editSubtaskComment, deleteSubtaskComment } from '../../features/subtaskSlice';
import { editTaskComment, deleteTaskComment } from '../../features/taskSlice';


const useCommentCard = () => {

    const dispatch = useDispatch<AppDispatch>();

    const [editModeId, setEditModeId] = useState<string | null>(null)
    const [showTimeAgo, setShowTimeAgo] = useState(true);

    const [commentText, setCommentText] = useState('');

    const timeStamp = (createdAt: Date, updatedAt: Date) => {
        const isEdited: boolean = createdAt !== updatedAt;
        return { timeString: showTimeAgo ? (isEdited ? timeAgo(updatedAt) : timeAgo(createdAt)) : formatDateTime(updatedAt), isEdited };
    };

    const toggleTimestampFormat = () => {
        setShowTimeAgo((prev) => !prev);
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setCommentText(e.target.value);
    };

    const handleCommentSubmit = async (taskId: string, subtaskId: string | null, commentId: string) => {
        if (commentText.trim()) {
            try {
                if (taskId && subtaskId && commentId) {
                    await dispatch(editSubtaskComment({ taskId, subtaskId, commentId, text: commentText.trim() }))
                    setCommentText('')
                    setEditModeId(null)
                } else if (taskId && !subtaskId && commentId) {
                    await dispatch(editTaskComment({ taskId, commentId, text: commentText.trim() }))
                    setCommentText('')
                    setEditModeId(null)
                }
            } catch (error) {
                // console.error("Error submitting comment:", error)
            }
        }
    };

    const handleEdit = async (commentId: string, text: string) => {
        setCommentText(text)
        setEditModeId(commentId)
    };
    const handleCancel = async () => {
        setCommentText('')
        setEditModeId(null)
    };
    const handleDelete = async (taskId: string, subtaskId: string | null, commentId: string) => {
        if (taskId && subtaskId && commentId) {
            await dispatch(deleteSubtaskComment({ taskId, subtaskId, commentId }))
        } else if (taskId && !subtaskId && commentId) {
            await dispatch(deleteTaskComment({ taskId, commentId }))
        }
    };

    return {
        editModeId,
        timeStamp,
        toggleTimestampFormat,
        handleEdit,
        handleCancel,
        commentText,
        handleCommentChange,
        handleCommentSubmit,
        handleDelete,
    }
}

export default useCommentCard;