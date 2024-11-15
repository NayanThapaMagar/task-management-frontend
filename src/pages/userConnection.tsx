import React, { useState } from 'react';
import { Box, Typography, IconButton, TextField, Menu, MenuItem, CircularProgress, Alert, Snackbar } from '@mui/material';
import { Add, Cancel, MoreHoriz, PersonAdd } from '@mui/icons-material';
import useUserConnections from '../hooks/useUserConnections';
import { User as UserConnectionType } from '../types';

const User: React.FC = () => {
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
                    <IconButton
                        onClick={handleToggleAddField}
                        aria-label="add user connection"
                        sx={{
                            color: 'white',
                            bgcolor: 'primary.light',
                            '&:hover': {
                                bgcolor: 'primary.main',
                            },
                            borderRadius: 2,
                            p: 1.5,
                        }}
                    >
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
                                <IconButton
                                    type="submit"
                                    aria-label="confirm add user connection"
                                    sx={{
                                        color: 'white',
                                        bgcolor: 'primary.main',
                                        '&:hover': {
                                            bgcolor: 'primary.dark',
                                        },
                                        p: 1.5,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mr: 1 }}>
                                        Add
                                    </Typography>
                                    <Add />
                                </IconButton>
                                <IconButton
                                    onClick={handleToggleAddField}
                                    aria-label="cancel add user connection"
                                    sx={{
                                        color: 'white',
                                        bgcolor: 'secondary.light',
                                        '&:hover': {
                                            bgcolor: 'secondary.main',
                                        },
                                        p: 1.5,
                                        borderRadius: 2,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                    }}
                                >
                                    <Typography variant="h6" sx={{ mr: 1 }}>
                                        Cancel
                                    </Typography>
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

export default User;
