import React from 'react';
import { Button, IconButton, Menu, MenuItem, List, Box, Typography, alpha, useTheme, Divider, CardContent, Card } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/NotificationsNone';
import NotificationCard from './NotificationCard';
import useNotificationBar from '../../hooks/notification/useNotificationBar';
import { MinWidth, MaxWidth, Border, BackgroundColor } from '../../types/props'

interface NotificationBarProps {
    onClose: () => void;
    minWidth?: MinWidth;
    maxWidth?: MaxWidth;
    border?: Border;
    backgroundColor?: BackgroundColor;
}

// Notification Bar Component
const NotificationBar: React.FC<NotificationBarProps> = ({ onClose, minWidth, maxWidth, border, backgroundColor }) => {
    const {
        anchorEl,
        showUnread,
        setShowUnread,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        handleDeleteNotification,
        handleNotificationClick,
        filteredNotifications,
        toggleMenu,
        handleMenuClose,
        navigate,
    } = useNotificationBar(onClose)

    const theme = useTheme();

    return (
        <Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: '12px',
                minWidth,
                maxWidth,
                border,
                backgroundColor,
            }}
        >
            <Box ml={2} mr={2} mt={3} mb={1}>
                <Box sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                }}>
                    <Typography variant="body1" sx={{
                        fontFamily: 'Roboto, Arial, sans-serif',
                        fontWeight: 550,
                        fontSize: '1.5rem',
                        color: 'text.primary',
                    }}>
                        Notifications
                    </Typography>

                    <IconButton onClick={toggleMenu} >
                        <MoreHoriz />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                        <MenuItem onClick={markAllAsRead}>Mark All as Read</MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); navigate('/notifications') }}>
                            Open Notifications
                        </MenuItem>
                    </Menu>
                </Box>
            </Box>

            <Box ml={3} >
                <Button
                    variant={showUnread ? 'contained' : 'text'}
                    sx={{
                        minWidth: 'auto',
                        padding: '0.1rem 0.8rem',
                        marginRight: 1,
                        textTransform: 'none',
                        borderRadius: 5,
                        color: showUnread ? "white" : 'inherit',
                        backgroundColor: showUnread ? alpha(theme.palette.primary.main, 0.9) : 'inherit',
                        '&:hover': {
                            backgroundColor: showUnread ? alpha(theme.palette.primary.main, 0.6) : 'grey.300',
                        },
                    }}
                    onClick={() => setShowUnread(false)}
                >
                    All
                </Button>
                <Button
                    variant={showUnread ? 'text' : 'contained'}
                    sx={{
                        minWidth: 'auto',
                        padding: '0.1rem 0.8rem',
                        textTransform: 'none',
                        borderRadius: 5,
                        color: showUnread ? 'inherit' : 'white',
                        backgroundColor: showUnread ? 'inherit' : alpha(theme.palette.primary.main, 0.9),
                        '&:hover': {
                            backgroundColor: showUnread ? 'grey.300' : alpha(theme.palette.primary.main, 0.6),
                        },
                    }}
                    onClick={() => setShowUnread(true)}
                >
                    Unread
                </Button>
            </Box>

            <Divider sx={{ mt: 1 }} />



            <List sx={{ padding: 0, overflowY: 'auto' }}>
                {filteredNotifications.length === 0 ? (
                    <Card
                        sx={{
                            maxWidth: 400,
                            padding: 3,
                            textAlign: 'center',
                            boxShadow: 2,
                            borderRadius: 2,
                        }}
                    >
                        <CardContent>
                            <NotificationsIcon
                                sx={{ fontSize: 60, color: 'grey.500', marginBottom: 2 }}
                            />
                            <Typography
                                variant="h6"
                                color="textSecondary"
                                gutterBottom
                            >
                                No Notifications Found
                            </Typography>
                            <Typography variant="body2" color="textSecondary">
                                You currently don't have any notifications. Check back later!
                            </Typography>
                            {/* <Button
                                variant="contained"
                                color="primary"
                                sx={{ marginTop: 2 }}
                                onClick={() => console.log('Refresh notifications')} // Replace with actual refresh logic
                            >
                                Refresh
                            </Button> */}
                        </CardContent>
                    </Card>
                ) : (
                    <Box>
                        {filteredNotifications.map((notification) => (
                            <NotificationCard
                                key={notification._id}
                                notification={notification}
                                onMarkAsRead={markAsRead}
                                onMarkAsUnread={markAsUnread}
                                onDelete={handleDeleteNotification}
                                onNotificationClick={handleNotificationClick}
                            />
                        ))}
                    </Box>
                )}
            </List>
        </Box >
    );
};

export default NotificationBar;