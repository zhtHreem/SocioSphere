import React, { useState, useEffect } from 'react';
import {
  Menu,
  MenuItem,
  ListItemIcon,
  Typography,
  Box,
  CircularProgress,
  Paper,
  IconButton,
  Badge,
  Alert,
  Divider,
  Tooltip
} from '@mui/material';
import axios from 'axios';
import {
  ChatBubbleOutline as ChatIcon,
  NotificationsOutlined as NotificationIcon,
  PersonAdd as PersonAddIcon,
  Favorite as FavoriteIcon,
  Error as ErrorIcon
} from '@mui/icons-material';

const Notifications = ({ anchorEl, onClose }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchNotifications = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_HOST_URL}/api/notifications/user/notifications`, {
          headers: {
            Authorization: token,
          },
        });
        setNotifications(response.data);
        setError(null);
      } catch (error) {
        setError('Failed to load notifications');
        console.error('Error fetching notifications:', error);
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchNotifications();
    }
  }, [token]);

  const getNotificationIcon = (type) => {
    const iconStyle = { color: 'primary.main' };
    switch (type) {
      case 'message':
        return <ChatIcon sx={iconStyle} />;
      case 'follow':
        return <PersonAddIcon sx={iconStyle} />;
      case 'like':
        return <FavoriteIcon sx={{ ...iconStyle, color: 'error.main' }} />;
      default:
        return <NotificationIcon sx={iconStyle} />;
    }
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const NotificationContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress size={24} />
        </Box>
      );
    }

    if (error) {
      return (
        <Alert severity="error" sx={{ m: 1 }}>
          {error}
        </Alert>
      );
    }

    if (notifications.length === 0) {
      return (
        <MenuItem disabled sx={{ textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            No notifications
          </Typography>
        </MenuItem>
      );
    }

    return notifications.map((notification, index) => (
      <React.Fragment key={notification._id}>
        <MenuItem 
          sx={{
            display: 'flex',
            py: 1.5,
            px: 2,
            '&:hover': {
              backgroundColor: 'action.hover',
            },
            bgcolor: notification.read ? 'transparent' : 'action.selected',
          }}
        >
          <ListItemIcon>
            {getNotificationIcon(notification.type)}
          </ListItemIcon>
          <Box sx={{ flex: 1, minWidth: 0 }}>
            <Typography
              variant="body2"
              sx={{
                fontWeight: notification.read ? 'regular' : 'medium',
                mb: 0.5
              }}
            >
              {notification.message}
            </Typography>
            <Typography
              variant="caption"
              sx={{ color: 'text.secondary' }}
            >
              {formatTimestamp(notification.createdAt)}
            </Typography>
          </Box>
        </MenuItem>
        {index < notifications.length - 1 && (
          <Divider />
        )}
      </React.Fragment>
    ));
  };

  return (
    <Menu
      anchorEl={anchorEl}
      open={Boolean(anchorEl)}
      onClose={onClose}
      PaperProps={{
        elevation: 3,
        sx: {
          minWidth: 320,
          maxWidth: 360,
          maxHeight: 400,
          overflow: 'auto',
          mt: 1.5,
          '& .MuiList-root': {
            padding: 0, }, }, }}
      transformOrigin={{ horizontal: 'right', vertical: 'top' }} anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}>
      <Box sx={{ px: 2, py: 1.5, borderBottom: 1, borderColor: 'divider' }}>
        <Typography variant="subtitle1" fontWeight="medium">
          Notifications
        </Typography>
      </Box>
      <NotificationContent />
    </Menu>
  );
};

// Notification trigger component
export const NotificationTrigger = ({ onClick }) => {
  const unreadCount = 3; // Replace with actual unread count

  return (
    <Tooltip title="Notifications">
      <IconButton onClick={onClick} size="large" sx={{'&:hover': {  backgroundColor: 'action.hover',  },}}  >
        <Badge badgeContent={unreadCount} color="error" overlap="circular" >
          <NotificationIcon />
        </Badge>
      </IconButton>
    </Tooltip>
  );
};

export default Notifications;