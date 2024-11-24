import React from 'react';
import { Button, IconButton, Menu, MenuItem, List, Box, Typography, alpha, useTheme, Divider, CardContent, Card } from '@mui/material';
import { MoreHoriz } from '@mui/icons-material';
import NotificationsIcon from '@mui/icons-material/NotificationsNone';
import NotificationCard from './NotificationCard';
import useNotificationBar from '../../hooks/notification/useNotificationBar';
import { MinWidth, MaxWidth } from '../../types/props'
import useNotificationLifecycle from '../../hooks/notification/useNotificationLifecycle ';

interface NotificationBarProps {
    onClose?: () => void;
    pageMode?: boolean | undefined;
    minWidth?: MinWidth;
    maxWidth?: MaxWidth;
}

// Notification Bar Component
const NotificationBar: React.FC<NotificationBarProps> = ({ onClose, pageMode, minWidth, maxWidth }) => {

    useNotificationLifecycle()

    const {
        anchorEl,
        showUnread,
        setShowUnread,
        markAsRead,
        markAsUnread,
        markAllAsRead,
        handleOpenNotifications,
        handleDeleteNotification,
        handleNotificationClick,
        filteredNotifications,
        toggleMenu,
        handleScroll,
        handleMenuClose,
    } = useNotificationBar(onClose)

    const theme = useTheme();

    return (
        <Box
            style={{
                height: '100%',
                maxHeight: 'inherit',
                display: 'flex',
                flexDirection: 'column',
                paddingBottom: '12px',
                minWidth,
                maxWidth,
            }}
        >
            {/* Header Section */}
            <Box
                ml={2}
                mr={2}
                mt={3}
                mb={1}
                sx={{
                    flexShrink: 0,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                    }}
                >
                    <Typography
                        variant="body1"
                        sx={{
                            fontFamily: 'Roboto, Arial, sans-serif',
                            fontWeight: 550,
                            fontSize: '1.5rem',
                            color: 'text.primary',
                        }}
                    >
                        Notifications
                    </Typography>

                    <IconButton onClick={toggleMenu}>
                        <MoreHoriz />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        <MenuItem onClick={markAllAsRead}>Mark All as Read</MenuItem>
                        {!pageMode && (
                            <MenuItem
                                onClick={handleOpenNotifications}
                            >
                                Open Notifications
                            </MenuItem>
                        )}
                    </Menu>
                </Box>
            </Box>

            {/* Filter Buttons Section */}
            <Box
                ml={3}
                sx={{
                    flexShrink: 0,
                }}
            >
                <Button
                    variant={showUnread ? 'contained' : 'text'}
                    sx={{
                        minWidth: 'auto',
                        padding: '0.1rem 0.8rem',
                        marginRight: 1,
                        textTransform: 'none',
                        borderRadius: 5,
                        color: showUnread ? 'white' : 'inherit',
                        backgroundColor: showUnread
                            ? alpha(theme.palette.primary.main, 0.9)
                            : 'inherit',
                        '&:hover': {
                            backgroundColor: showUnread
                                ? alpha(theme.palette.primary.main, 0.6)
                                : 'grey.300',
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
                        backgroundColor: showUnread
                            ? 'inherit'
                            : alpha(theme.palette.primary.main, 0.9),
                        '&:hover': {
                            backgroundColor: showUnread
                                ? 'grey.300'
                                : alpha(theme.palette.primary.main, 0.6),
                        },
                    }}
                    onClick={() => setShowUnread(true)}
                >
                    Unread
                </Button>
            </Box>

            <Divider sx={{ mt: 1 }} />

            {/* Notifications List Section */}
            <Box
                sx={{
                    flexGrow: 1, // Make the list grow to take up remaining space
                    overflowY: 'auto', // Enable scrolling within this section
                    padding: 0,
                    minWidth: '100%',
                    display: 'flex',
                    justifyContent: 'center',
                }}
                onScroll={handleScroll}
            >
                <List sx={{ width: '100%' }}>
                    {filteredNotifications.length === 0 ? (
                        <Card
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                maxWidth: '100%',
                                padding: 3,
                                textAlign: 'center',
                                boxShadow: 'none',
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
                                    You currently don't have any notifications. Check back
                                    later!
                                </Typography>
                            </CardContent>
                        </Card>
                    ) : (
                        <Box width={'100%'}>
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
            </Box>
        </Box>

    );
};

export default NotificationBar;