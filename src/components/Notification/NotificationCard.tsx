import React from "react";
import { MoreHoriz } from "@mui/icons-material";
import { ListItem, ListItemAvatar, Avatar, ListItemText, Typography, IconButton, Menu, MenuItem, Box } from "@mui/material";
import useNotificationCard from "../../hooks/notification/useNotificationCard";
import { getInitials, timeAgo } from "../../utils";
import { Notification } from "../../types";

interface NotificationCardProps {
    notification: Notification;
    onMarkAsRead: (notificationId: string) => void;
    onMarkAsUnread: (notificationId: string) => void;
    onDelete: (notificationId: string) => void;
    onNotificationClick: (notification: Notification) => void;
}

const NotificationCard: React.FC<NotificationCardProps> = ({ notification, onMarkAsRead, onMarkAsUnread, onDelete, onNotificationClick }) => {

    const {
        anchorEl,
        handleMoreClick,
        handleMenuClose,
    } = useNotificationCard();

    return (
        <ListItem
            onClick={() => onNotificationClick(notification)}
            sx={{
                height: 'auto',
                display: 'flex',
                alignItems: 'flex-start',
                cursor: 'pointer',
                gap: '0.5rem',
                p: '0px',
                pl: '10px',
                pr: '10px',
                '&:hover': {
                    backgroundColor: 'grey.200',
                },
                '&:hover .icon-button': {
                    opacity: 1,
                    visibility: 'visible',
                    backgroundColor: 'grey.300',
                },
            }}
        >
            <ListItemAvatar
                sx={{
                    display: 'flex',
                    alignItems: 'center',
                    minWidth: 40,
                    pt: '12px',
                }}
            >
                <Avatar
                    alt={notification.originatorId.username}
                    sx={{
                        backgroundColor: 'darkcyan',
                        width: 40,
                        height: 40,
                    }}
                >
                    {getInitials(notification.originatorId.username)}
                </Avatar>
            </ListItemAvatar>
            <Box
                sx={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    width: '100%',
                }}
            >
                <ListItemText
                    sx={{
                        flex: 1,
                        p: '0px',
                        pt: '12px',
                        pb: '12px',
                        m: '0px',
                    }}
                    primary={
                        <Typography style={{ fontWeight: notification.isRead ? 'normal' : 'bold' }}>
                            {notification.message}
                        </Typography>
                    }
                    secondary={
                        <Box style={{ display: 'flex', justifyContent: 'flex-start', gap: '0.5rem' }}>
                            <Typography variant="caption">{notification.originatorId.username}</Typography>
                            <Typography variant="caption">{timeAgo(notification.createdAt)}</Typography>
                        </Box>
                    }
                />
                <IconButton
                    className="icon-button"
                    sx={{
                        position: 'absolute',
                        top: '50%',
                        right: '10px',
                        transform: 'translateY(-50%)',
                        opacity: 0,
                        visibility: 'hidden',
                        transition: 'opacity 0.3s, visibility 0.3s',
                        '&:hover': {
                            backgroundColor: 'grey.400',
                        },
                    }}
                    onClick={(e) => handleMoreClick(e)}
                >
                    <MoreHoriz />
                </IconButton>
                <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                    {!notification.isRead && <MenuItem onClick={(e) => { onMarkAsRead(notification._id); handleMenuClose(e); }}>
                        Mark as Read
                    </MenuItem>}
                    {notification.isRead && <MenuItem onClick={(e) => { onMarkAsUnread(notification._id); handleMenuClose(e); }}>
                        Mark as Unread
                    </MenuItem>}
                    <MenuItem onClick={(e) => { onDelete(notification._id); handleMenuClose(e); }}>
                        Delete Notification
                    </MenuItem>
                </Menu>
            </Box>
        </ListItem>
    );
};

export default React.memo(NotificationCard);