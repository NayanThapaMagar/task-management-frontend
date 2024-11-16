import React from 'react';
import { Typography, Button, TextField, FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, Divider, Box, Alert, Snackbar, CircularProgress, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import PlaylistAddOutlinedIcon from '@mui/icons-material/PlaylistAddOutlined';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import useTaskDetail from '../../hooks/task/useTaskDetail';
import { useNavigate } from 'react-router-dom';
import SubtaskCard from '../../components/Task/SubtaskCard';
import CommentBox from '../../components/Comment/CommnetBox';
import CommentCard from '../../components/Comment/CommentCard'

const TaskDetail: React.FC = () => {

    const {
        editMode,
        selectedTask,
        title,
        description,
        priority,
        assignedTo,
        allConnections,
        allTaskComments,
        setTitle,
        setDescription,
        setPriority,
        isDescriptionHovered,
        setIsDescriptionHovered,
        handleAssignedToChange,
        handleComponentClick,
        handleUpdate,
        groupedSubtasks,
        handleSubtaskClick,
        subtaskPriorityFilter,
        handleSubtaskPriorityFilterChange,
        subtaskCategory,
        handleSubtaskCategoryChange,
        handleDragSubtaskStart,
        handleDragSubtaskOver,
        handleDropSubtask,
        handleClose,
        loading,
        success,
        error,
        openSnackbar,
        handleSnackbarClose,
    } = useTaskDetail();

    const navigate = useNavigate();

    if (!selectedTask) {
        navigate('/tasks');
    }

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
                    <Typography variant="h5">Task Detail</Typography>
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
                            <Typography variant="body1" sx={{ minWidth: "54px" }}>{selectedTask?.status.toUpperCase()}</Typography>
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

                    {/* horizontal dashed line
                    <Box
                        sx={{
                            mt: 2,
                            mb: 2,
                            width: '100%',
                            borderColor: 'divider',
                        }}
                    >
                        <svg
                            width="100%"
                            height="1"
                        >
                            <line
                                x1="0"
                                y1="1"
                                x2="100%"
                                y2="1"
                                stroke="currentColor"
                                strokeWidth="0.5"
                                strokeDasharray="15, 7"
                            />
                        </svg>
                    </Box> */}


                    {loading ? (
                        <CircularProgress />
                    ) : (
                        <Box mt={4}>
                            <Typography variant="body1" fontWeight="bold" m={1}>Subtask List</Typography>
                            <Box>
                                <Box display="flex" justifyContent="space-between" mb={2}>
                                    <FormControl fullWidth margin="normal">
                                        {/* <FormLabel>View Subtasks</FormLabel> */}
                                        <RadioGroup row value={subtaskCategory} onChange={handleSubtaskCategoryChange}>
                                            <FormControlLabel value="all" control={<Radio />} label="All Tasks" />
                                            <FormControlLabel value="myTasks" control={<Radio />} label="My Tasks" />
                                            <FormControlLabel value="assignedTasks" control={<Radio />} label="Assigned Tasks" />
                                        </RadioGroup>
                                    </FormControl>
                                    <FormControl variant="outlined" style={{ width: '150px' }} margin="normal">
                                        <InputLabel>Priority</InputLabel>
                                        <Select
                                            value={subtaskPriorityFilter}
                                            onChange={handleSubtaskPriorityFilterChange}
                                            label="Priority"
                                        >
                                            <MenuItem value="all">All</MenuItem>
                                            <MenuItem value="high">High</MenuItem>
                                            <MenuItem value="medium">Medium</MenuItem>
                                            <MenuItem value="low">Low</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>

                                {Object.values(groupedSubtasks).some((subtaskArray) => subtaskArray.length > 0)
                                    && <Box
                                        gap={1}
                                        sx={{
                                            display: 'flex',
                                            flexDirection: 'row',
                                            overflowX: 'auto',
                                            flexWrap: 'nowrap',
                                        }}
                                    >
                                        {Object.entries(groupedSubtasks).map(([status, subtasks]) => (
                                            <Box
                                                key={status}
                                                onDragOver={handleDragSubtaskOver}
                                                onDrop={(e) => handleDropSubtask(e, status)}
                                                sx={{
                                                    padding: 1,
                                                    margin: 1,
                                                    border: '1px solid #ccc',
                                                    borderRadius: '8px',
                                                    boxShadow: 2,
                                                    backgroundColor: 'background.paper',
                                                    minWidth: '150px',
                                                    minHeight: '150px',
                                                    flexGrow: 1,
                                                    flexBasis: 0,
                                                    '&:hover': {
                                                        borderColor: 'currentcolor',
                                                    },
                                                }}
                                            >
                                                <Box mb={2}>
                                                    <h3>{status}</h3>
                                                    <SubtaskCard taskId={selectedTask?._id as string} subtasks={subtasks} onSubtaskClick={handleSubtaskClick} draggedSubtaskStatus={status} onSubtaskDragStart={handleDragSubtaskStart} />
                                                </Box>
                                            </Box>
                                        ))}
                                    </Box>}

                            </Box>
                        </Box>
                    )}

                    <Box display="flex" justifyContent="space-between" alignItems="center" mt={2}>
                        <Button
                            color="secondary"
                            variant="outlined"
                            startIcon={<PlaylistAddOutlinedIcon fontSize="medium" />}
                            onClick={() => navigate('/tasks/addSubtask')}
                            sx={{
                                px: 3,
                                py: 1,
                                fontWeight: 'bold',
                                borderRadius: 2,
                                borderColor: 'secondary.main',
                                '&:hover': {
                                    color: 'white',
                                    backgroundColor: 'secondary.light',
                                    borderColor: 'secondary.dark',
                                },
                            }}
                        >
                            Add Subtask
                        </Button>
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

                    <Typography variant="body1" fontWeight="bold" mt={4}>Activity</Typography>

                    <CommentBox taskId={selectedTask?._id as string} subtaskId={null} />

                    <CommentCard comments={allTaskComments} taskId={selectedTask?._id as string} subtaskId={null} />

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
