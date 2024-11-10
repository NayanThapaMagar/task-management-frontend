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
    Assignment,
    People,
    ChevronLeft,
    ChevronRight,
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
                    width: drawerOpen ? 240 : 56,
                    '& .MuiDrawer-paper': {
                        width: drawerOpen ? 240 : 56,
                        overflowX: 'hidden',
                        transition: 'width 0.3s',
                    },
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
                            <Assignment />
                        </ListItemIcon>
                        <ListItemText primary="Tasks" />
                    </ListItemButton>
                    <ListItemButton onClick={() => handleNavigation('/userConnection')}>
                        <ListItemIcon>
                            <People />
                        </ListItemIcon>
                        <ListItemText primary="User Connections" />
                    </ListItemButton>
                    <ListItemButton onClick={handleLogout}>
                        <ListItemIcon>
                            <Logout />
                        </ListItemIcon>
                        <ListItemText primary="Logout" />
                    </ListItemButton>
                </List>
            </Drawer>

            <IconButton
                onClick={() => setDrawerOpen(!drawerOpen)}
                sx={{
                    position: 'fixed',
                    left: drawerOpen ? 220 : 36,
                    transition: 'left 0.3s',
                    top: '500px',
                    backgroundColor: 'grey.100', 
                    color: 'black', 
                    zIndex: 1300, 
                    '&:hover': {
                        backgroundColor: 'grey.300', 
                    },
                }}
            >
                {drawerOpen ? <ChevronLeft /> : <ChevronRight />}
            </IconButton>
        </Box>

    );
};

export default MainNavbar;
