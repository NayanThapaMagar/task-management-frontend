import React, { useState } from 'react';
import { Box, Typography, IconButton, TextField, Menu, MenuItem, CircularProgress, Alert, Snackbar } from '@mui/material';
import { Add, Cancel, MoreHoriz, PersonAdd } from '@mui/icons-material';
import useUserConnections from '../hooks/useUserConnections';
import { UserConnection as UserConnectionType } from '../types';

const UserConnection: React.FC = () => {
    const {
        filteredConnections,
        searchQuery,
        userName,
        loading,
        error,
        success,
        openSnackbar,
        handleSnackbarClose,
        setUserName,
        handleSearchChange,
        handleAddConnection,
        handleRemoveConnection,
    } = useUserConnections();

    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [currentConnectionOnMenu, setCurrentConnectionOnMenu] = useState<UserConnectionType | null>(null);
    const [showAddUserConnectionField, setShowAddUserConnectionField] = useState(false);


    const handleTaskMenuClick = (event: React.MouseEvent<HTMLElement>, connection: UserConnectionType) => {
        setAnchorEl(event.currentTarget);
        setCurrentConnectionOnMenu(connection);
    };

    const handleUserMenuClose = () => {
        setAnchorEl(null);
        setCurrentConnectionOnMenu(null);
    };

    const handleToggleAddField = () => {
        setShowAddUserConnectionField((prev) => !prev);
    };

    return (
        <Box padding={2}>
            <Typography variant="h4" gutterBottom>
                User Connections
            </Typography>

            <TextField
                label="Search by Username or Email"
                variant="outlined"
                fullWidth
                value={searchQuery}
                onChange={handleSearchChange}
                margin="normal"
            />

            {loading ? (
                <Box display="flex" justifyContent="center" alignItems="center" height="100px">
                    <CircularProgress />
                </Box>
            ) : (
                <Box>
                    {filteredConnections.map((connection) => (
                        <Box
                            key={connection._id}
                            border={1}
                            borderColor="grey.300"
                            borderRadius={2}
                            padding={2}
                            marginBottom={2}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                cursor: 'pointer',
                                '&:hover': { backgroundColor: 'grey.100' },
                            }}
                        >
                            <Box>
                                <Typography variant="h6">{connection.username}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {connection.email}
                                </Typography>
                            </Box>
                            <IconButton
                                aria-label="more"
                                onClick={(e) => handleTaskMenuClick(e, connection)}
                            >
                                <MoreHoriz />
                            </IconButton>
                            <Menu
                                anchorEl={anchorEl}
                                open={Boolean(anchorEl)}
                                onClose={handleUserMenuClose}
                                onClick={handleUserMenuClose}
                            >
                                <MenuItem onClick={() => handleRemoveConnection(currentConnectionOnMenu)}>Remove</MenuItem>
                            </Menu>
                        </Box>
                    ))}
                </Box>
            )}

            <Box textAlign="center">
                {!showAddUserConnectionField ? (
                    <IconButton onClick={handleToggleAddField} color="primary" aria-label="add user connection">
                        <PersonAdd fontSize="large" />
                    </IconButton>
                ) : (
                    <Box mt={2} width="100%">
                        <form onSubmit={handleAddConnection}>
                            <TextField
                                label="Username"
                                fullWidth
                                margin="normal"
                                value={userName}
                                onChange={(e) => setUserName(e.target.value)}
                                required
                            />
                            <Box display="flex" justifyContent="center" gap={1} mt={1}>
                                <IconButton type='submit' color="primary" aria-label="confirm add user connection">
                                    <Typography variant="h6">Add</Typography>
                                    <Add />
                                </IconButton>
                                <IconButton onClick={handleToggleAddField} color="primary" aria-label="cancel add user connection">
                                    <Typography variant="h6">Cancel</Typography>
                                    <Cancel />
                                </IconButton>
                            </Box>
                        </form>
                    </Box>
                )}
            </Box>
            {
                (success || error) && (
                    <Snackbar
                        open={openSnackbar}
                        autoHideDuration={3000}
                        onClose={handleSnackbarClose}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    >
                        <Alert
                            onClose={handleSnackbarClose}
                            severity={success ? 'success' : 'error'}
                        >
                            {success || error}
                        </Alert>
                    </Snackbar>
                )
            }
        </Box >
    );
};

export default UserConnection;
