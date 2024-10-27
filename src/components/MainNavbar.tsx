import React, { useState } from 'react';
import {
    AppBar,
    Toolbar,
    Typography,
    IconButton,
    Badge,
    Menu,
    MenuItem,
    List,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    Drawer,
    Box,
} from '@mui/material';
import {
    Notifications,
    AccountCircle,
    Menu as MenuIcon,
    Dashboard as DashboardIcon,
    Logout,
    Assignment, // Import the Assignment icon for tasks
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store';
import { logout } from '../features/authSlice';

const MainNavbar: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const navigate = useNavigate();
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [drawerOpen, setDrawerOpen] = useState(false);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        dispatch(logout()).then(() => navigate('/login'));
    };

    // Function to handle navigation and close drawer
    const handleNavigation = (path: string) => {
        navigate(path);
        setDrawerOpen(false); // Close the drawer on navigation
    };

    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={() => setDrawerOpen(!drawerOpen)}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Task Manager
                    </Typography>
                    <IconButton color="inherit">
                        <Badge badgeContent={9} color="error">
                            <Notifications />
                        </Badge>
                    </IconButton>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                        <AccountCircle />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={() => navigate('/profile')}>Profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Logout</MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                sx={{
                    width: 240,
                    '& .MuiDrawer-paper': { width: 240 },
                }}
            >
                <Toolbar />
                <List>
                    <ListItemButton onClick={() => handleNavigation('/')}>
                        <ListItemIcon>
                            <DashboardIcon />
                        </ListItemIcon>
                        <ListItemText primary="Dashboard" />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleNavigation('/tasks')}>
                        <ListItemIcon>
                            <Assignment /> {/* Icon for Tasks */}
                        </ListItemIcon>
                        <ListItemText primary="Tasks" />
                    </ListItemButton>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </List>
            </Drawer>
        </Box>

    );
};

export default MainNavbar;
