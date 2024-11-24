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
        isSubtasksAtScrollTop,
        handleSubtasksScroll,
        handleCommentsScroll,
        handleClose,
        loading,
        success,
        error,
        openSnackbar,
        handleSnackbarClose,
    } = useTaskDetail();

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
                <Box
                    sx={{
                        overflow: 'auto',
                        maxHeight: 'calc(100vh - 66px)',
                        maxWidth: 'calc(100vw - 57px)',
                    }}
                    onScroll={handleCommentsScroll}
                >
                    <Box sx={{ p: 2, pt: 4, pb: 4 }}>
                        <Typography variant="h5">Task Detail</Typography>
                        <Divider sx={{ mt: 2, mb: 2 }} />
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box margin="none" sx={{
                                flexGrow: 1,
                            }}>
                                <TextField
                                    fullWidth
                                    margin="none"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    sx={{
                                        flexGrow: 1,
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

                            <Box display="flex" alignItems="center" marginLeft={2}>
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
                                        <Box>
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
                                        Box.ql-container.ql-snow.ql-disabled, .ql-editor {
                                            ${Object.entries(editModeReactQuillStyles).map(([key, value]) => `${key}: ${value};`).join(' ')}
                                        }
                                    `}</style>
                                        </Box>
                                    )}
                                    {!editMode.description && (
                                        <Box
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
                                        Box.ql-container.ql-snow.ql-disabled, .ql-editor {
                                            ${Object.entries(readModeReactQuillStyles).map(([key, value]) => `${key}: ${value};`).join(' ')}
                                        }
                                    `}</style>
                                        </Box>
                                    )}
                                </Box>
                            </Box>

                            <Box display="flex" flexWrap="wrap" flexDirection="row" gap={2}>
                                <Box flex={1} minWidth="200px" onClick={() => handleComponentClick('priority')}>
                                    <FormControl fullWidth margin="none">
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
                                    <FormControl fullWidth margin="none" onClick={() => handleComponentClick('assignedTo')}>
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
                                        <FormControl fullWidth margin="none">
                                            {/* <FormLabel>View Subtasks</FormLabel> */}
                                            <RadioGroup row value={subtaskCategory} onChange={handleSubtaskCategoryChange}>
                                                <FormControlLabel value="all" control={<Radio />} label="All Subtasks" />
                                                <FormControlLabel value="myTasks" control={<Radio />} label="My Subtasks" />
                                                <FormControlLabel value="assignedTasks" control={<Radio />} label="Assigned Subtasks" />
                                            </RadioGroup>
                                        </FormControl>
                                        <FormControl variant="outlined" style={{ width: '150px' }} margin="none">
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
                                        &&
                                        <Box
                                            sx={{
                                                maxHeight: '44vh',
                                                overflowY: 'auto',
                                                paddingRight: '16px',
                                            }}
                                            onScroll={handleSubtasksScroll}
                                        >
                                            <Box
                                                gap={0.3}
                                                sx={{
                                                    display: 'flex',
                                                    flexDirection: 'row',
                                                    flexWrap: 'nowrap',
                                                }}
                                            >
                                                {Object.entries(groupedSubtasks).map(([status, subtasks]) => (
                                                    <Box
                                                        key={status}
                                                        onDragOver={handleDragSubtaskOver}
                                                        onDrop={(e) => handleDropSubtask(e, status)}
                                                        sx={{
                                                            padding: 0,
                                                            margin: 0,
                                                            backgroundColor: 'grey.100',
                                                            minWidth: '150px',
                                                            flexGrow: 1,
                                                            flexBasis: 0,
                                                            '&:hover': {
                                                                borderColor: 'currentcolor',
                                                            },
                                                        }}
                                                    >
                                                        <Box sx={{
                                                            height: '100%',
                                                        }}>
                                                            <Box
                                                                className="status-header"
                                                                sx={{
                                                                    padding: '6px',
                                                                    textAlign: 'center',
                                                                    position: 'sticky',
                                                                    top: 0,
                                                                    zIndex: 1,
                                                                    backgroundColor: 'grey.100',
                                                                    transition: 'box-shadow 0.3s ease',
                                                                    borderBottom: !isSubtasksAtScrollTop ? '1px solid #ccc' : 'none',
                                                                }}
                                                            >
                                                                <h3
                                                                    style={{
                                                                        margin: 0,
                                                                        fontWeight: '500',
                                                                        fontSize: '1rem',
                                                                    }}
                                                                >
                                                                    {status}
                                                                </h3>
                                                            </Box>
                                                            <Box
                                                                sx={{
                                                                    minHeight: '300px',
                                                                    padding: 0.3,
                                                                    paddingBottom: 0,
                                                                    paddingTop: 0,
                                                                }}
                                                            >
                                                                <SubtaskCard taskId={selectedTask?._id as string} subtasks={subtasks} onSubtaskClick={handleSubtaskClick} draggedSubtaskStatus={status} onSubtaskDragStart={handleDragSubtaskStart} />
                                                            </Box>
                                                        </Box>
                                                    </Box>
                                                ))}
                                            </Box>
                                        </Box>
                                    }
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
                </Box>
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
