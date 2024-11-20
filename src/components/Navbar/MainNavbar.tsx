import React from 'react';
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
    Popover,
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
import NotificationBar from '../Notification/NotificationBar';
import useMainNavbar from '../../hooks/navbar/useMainNavbar';
import { useAppState } from '../../context/AppStateContext';


const MainNavbar: React.FC = () => {

    const {
        isNotificationsPageMode
    } = useAppState();

    const {
        anchorEl,
        drawerOpen,
        setDrawerOpen,
        notificationAnchorEl,
        unSeenNotificationsCount,
        allNotifications,
        toggleNotification,
        handleNotificationBarClose,
        handleAccountMenuOpen,
        handleAccountMenuClose,
        handleScroll,
        navigate,
        handleNavigation,
        handleLogout,
    } = useMainNavbar()


    return (
        <Box sx={{ display: 'flex' }}>
            <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        edge="start"
                        onClick={() => setDrawerOpen(!drawerOpen)}
                        sx={{
                            mr: 2,
                            '&:hover': {
                                backgroundColor: 'primary.dark',
                            },
                        }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        Task Manager
                    </Typography>
                    <Box>
                        <IconButton
                            disabled={isNotificationsPageMode}
                            color="inherit"
                            onClick={toggleNotification}
                            sx={{
                                '&.Mui-disabled': {
                                    color: 'grey.400',
                                    backgroundColor: 'primary.light',
                                },
                                '&:hover': {
                                    backgroundColor: isNotificationsPageMode ? 'primary.light' : 'primary.dark',
                                },
                            }}>
                            <Badge badgeContent={unSeenNotificationsCount} color="error">
                                <Notifications />
                            </Badge>
                        </IconButton>
                        <Popover
                            open={Boolean(notificationAnchorEl)}
                            anchorEl={notificationAnchorEl}
                            onClose={handleNotificationBarClose}
                            onScroll={handleScroll}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'center',
                            }}
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'center',
                            }}
                            // sx={{
                            //     padding: '20px',
                            //     color: 'red'
                            // }}
                        // disablePortal={true} // Ensures the popover doesn't trap focus
                        // disableEnforceFocus={true} // Prevents focus from being restricted within the popover
                        // disableAutoFocus={true} // Allows other buttons to retain focus behavior
                        >
                            <NotificationBar notifications={allNotifications} maxWidth='350px' onClose={handleNotificationBarClose} />
                        </Popover>
                    </Box>
                    <IconButton color="inherit" onClick={handleAccountMenuOpen} sx={{
                        '&:hover': {
                            backgroundColor: 'primary.dark',
                        },
                    }} >
                        <AccountCircle />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleAccountMenuClose}
                    // disablePortal={true}
                    // disableAutoFocus={true}
                    // disableEnforceFocus={true}
                    // disableRestoreFocus={true}
                    >
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
                    left: drawerOpen ? 227 : 46,
                    transition: 'left 0.3s',
                    top: '100px',
                    backgroundColor: 'grey.100',
                    color: 'black',
                    width: 23,
                    height: 23,
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
