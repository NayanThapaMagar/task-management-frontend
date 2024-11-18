import React from 'react';
import { Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, Divider, Box, Alert, Snackbar, CircularProgress } from '@mui/material';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useSubtaskDetail from '../../hooks/subtask/useSubtaskDetail';
import { useNavigate } from 'react-router-dom';
import CommentBox from '../../components/Comment/CommnetBox'
import CommentCard from '../../components/Comment/CommentCard'

const TaskDetail: React.FC = () => {

    const {
        editMode,
        selectedTask,
        selectedSubtask,
        title,
        description,
        priority,
        assignedTo,
        allConnections,
        allSubtaskComments,
        setTitle,
        setDescription,
        setPriority,
        isDescriptionHovered,
        setIsDescriptionHovered,
        handleAssignedToChange,
        handleComponentClick,
        handleUpdate,
        handleClose,
        loading,
        success,
        error,
        openSnackbar,
        handleSnackbarClose,

    } = useSubtaskDetail();

    const navigate = useNavigate();

    // Styles for the typing area (editor)
    const readModeReactQuillStyles = {
        "background-color": isDescriptionHovered ? '#f0f0f0' : 'white',
        height: 'auto',
        "min-height": '350px',
        "overflow-y": 'auto',
        border: "none",
    };
    const editModeReactQuillStyles = {
        height: 'auto',
        "min-height": '350px',
        "overflow-y": 'auto',
    };

    return (
        <Box>
            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                    <CircularProgress />
                </Box>
            ) : (
                <Box sx={{ p: 2, mt: 2 }}>
                    <Typography variant="h5">Subtask Detail</Typography>
                    <Divider sx={{ mt: 2, mb: 2 }} />
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                        <Box margin="normal">
                            <TextField
                                fullWidth
                                margin="normal"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                required
                                sx={{
                                    maxWidth: '300px',
                                    minWidth: '200px',
                                    '& fieldset': editMode.title ? { border: 1 } : { border: 'none' },
                                    '& input': {
                                        fontWeight: 'bolder',
                                        fontSize: '1.4rem',
                                    },
                                    '&:hover': {
                                        backgroundColor: '#f0f0f0',
                                    },
                                }}
                                slotProps={{
                                    input: {
                                        readOnly: !editMode.title,
                                    },
                                }}
                                onClick={() => handleComponentClick('title')}
                            />
                        </Box>

                        <Box display="flex" alignItems="center" margin="normal">
                            <Typography variant="body1" fontWeight="bold" sx={{ marginRight: 1 }}>
                                Status:
                            </Typography>
                            <Typography variant="body1" sx={{ minWidth: "54px" }}>{selectedSubtask?.status.toUpperCase()}</Typography>
                        </Box>
                    </Box>

                    <Box p={0.5}>
                        <Box>
                            <Typography variant="body1" fontWeight="bold" m={1}>Description</Typography>
                            <Box onClick={() => handleComponentClick('description')}>
                                {editMode.description && (
                                    <div>
                                        <ReactQuill
                                            value={description}
                                            onChange={setDescription}
                                            style={{
                                                marginBottom: '3rem',
                                                height: 'auto',
                                                minHeight: '350px',
                                                overflowY: 'auto',
                                            }}
                                        />
                                        <style>{`
                                        div.ql-container.ql-snow.ql-disabled, .ql-editor {
                                            ${Object.entries(editModeReactQuillStyles).map(([key, value]) => `${key}: ${value};`).join(' ')}
                                        }
                                    `}</style>
                                    </div>
                                )}
                                {!editMode.description && (
                                    <div
                                        onMouseEnter={() => setIsDescriptionHovered(true)}
                                        onMouseLeave={() => setIsDescriptionHovered(false)}
                                    >

                                        <ReactQuill
                                            value={description}
                                            style={{
                                                marginBottom: '3rem',
                                                height: 'auto',
                                                minHeight: '350px',
                                                overflowY: 'auto',
                                            }}
                                            readOnly={true}
                                            theme="snow"
                                            modules={{ toolbar: false }}
                                        />
                                        <style>{`
                                        div.ql-container.ql-snow.ql-disabled, .ql-editor {
                                            ${Object.entries(readModeReactQuillStyles).map(([key, value]) => `${key}: ${value};`).join(' ')}
                                        }
                                    `}</style>
                                    </div>
                                )}
                            </Box>
                        </Box>

                        <Box display="flex" flexWrap="wrap" flexDirection="row" gap={2}>
                            <Box flex={1} minWidth="200px" onClick={() => handleComponentClick('priority')}>
                                <FormControl fullWidth margin="normal">
                                    <InputLabel shrink>Priority</InputLabel>
                                    <Select
                                        value={priority}
                                        onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
                                        label="Priority"
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#f0f0f0',
                                                cursor: 'pointer',
                                            },
                                        }}
                                    >
                                        <MenuItem value="low">Low</MenuItem>
                                        <MenuItem value="medium">Medium</MenuItem>
                                        <MenuItem value="high">High</MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box flex={1} minWidth="200px">
                                <FormControl fullWidth margin="normal" onClick={() => handleComponentClick('assignedTo')}>
                                    <InputLabel>Assign To</InputLabel>
                                    <Select
                                        multiple
                                        value={assignedTo}
                                        onChange={handleAssignedToChange}
                                        input={<OutlinedInput label="Assign To" />}
                                        renderValue={(selected) => (
                                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                                {selected.map((value) => {
                                                    const user = allConnections.find((connection) => connection._id === value);
                                                    return user ? <Chip key={value} label={user.username} size='small' /> : null;
                                                })}
                                            </Box>
                                        )}
                                        MenuProps={{
                                            PaperProps: {
                                                style: {
                                                    maxHeight: 200,
                                                    overflowY: 'auto',
                                                },
                                            },
                                        }}
                                        sx={{
                                            '&:hover': {
                                                backgroundColor: '#f0f0f0',
                                                cursor: 'pointer',
                                            },
                                        }}
                                    >
                                        {allConnections.map((connection) => (
                                            <MenuItem key={connection._id} value={connection._id}>
                                                {connection.username}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                    </Box>

                    <Divider sx={{ mt: 2, mb: 2 }} />

                    <Box display="flex" justifyContent="flex-start" gap={2} mt={2}>
                        {(editMode.title || editMode.description || editMode.priority || editMode.assignedTo) && (
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleUpdate}
                                sx={{
                                    px: 3,
                                    py: 1,
                                    fontWeight: 'bold',
                                    borderRadius: 2,
                                    backgroundColor: 'primary.main',
                                    '&:hover': {
                                        backgroundColor: 'primary.dark',
                                    },
                                }}
                            >
                                Save Changes
                            </Button>
                        )}

                        <Button
                            onClick={handleClose}
                            sx={{
                                px: 3,
                                py: 1,
                                fontWeight: 'bold',
                                borderRadius: 2,
                                color: 'text.secondary',
                                backgroundColor: 'grey.100',
                                '&:hover': {
                                    backgroundColor: 'grey.200',
                                },
                            }}
                        >
                            Close
                        </Button>
                    </Box>

                    <Typography variant="body1" fontWeight="bold" m={1}>Activity</Typography>

                    <CommentBox taskId={selectedTask?._id as string} subtaskId={selectedSubtask?._id as string} />

                    <CommentCard comments={allSubtaskComments} taskId={selectedTask?._id as string} subtaskId={selectedSubtask?._id as string} />

                </Box >
            )}

            {(success || error) && (
                <Snackbar
                    open={openSnackbar}
                    autoHideDuration={3000}
                    onClose={handleSnackbarClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                >
                    <Alert onClose={handleSnackbarClose} severity={success ? 'success' : 'error'}>
                        {success || error}
                    </Alert>
                </Snackbar>
            )}
        </Box>
    );
};

export default TaskDetail;
