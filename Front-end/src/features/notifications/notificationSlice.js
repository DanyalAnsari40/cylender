import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/notifications';

// Fetch notifications for a user
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ recipientId, recipientRole }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}?recipientId=${recipientId}&recipientRole=${recipientRole}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch notifications');
    }
  }
);

// Get unread count
export const fetchUnreadCount = createAsyncThunk(
  'notifications/fetchUnreadCount',
  async ({ recipientId, recipientRole }, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/unread-count?recipientId=${recipientId}&recipientRole=${recipientRole}`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch unread count');
    }
  }
);

// Mark notification as read
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/${notificationId}/read`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to mark as read');
    }
  }
);

// Mark all notifications as read
export const markAllAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async ({ recipientId, recipientRole }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`${API_URL}/mark-all-read`, {
        recipientId,
        recipientRole
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to mark all as read');
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/${notificationId}`);
      return notificationId;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to delete notification');
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: {
    notifications: [],
    unreadCount: 0,
    status: 'idle',
    error: null,
    isOpen: false
  },
  reducers: {
    toggleNotifications: (state) => {
      state.isOpen = !state.isOpen;
    },
    closeNotifications: (state) => {
      state.isOpen = false;
    },
    addNotification: (state, action) => {
      state.notifications.unshift(action.payload);
      if (!action.payload.isRead) {
        state.unreadCount += 1;
      }
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch notifications
      .addCase(fetchNotifications.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.notifications = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch unread count
      .addCase(fetchUnreadCount.fulfilled, (state, action) => {
        state.unreadCount = action.payload.count;
      })
      
      // Mark as read
      .addCase(markNotificationAsRead.fulfilled, (state, action) => {
        const index = state.notifications.findIndex(n => n._id === action.payload._id);
        if (index !== -1) {
          state.notifications[index] = action.payload;
          if (!action.payload.isRead) {
            state.unreadCount = Math.max(0, state.unreadCount - 1);
          }
        }
      })
      
      // Mark all as read
      .addCase(markAllAsRead.fulfilled, (state) => {
        state.notifications.forEach(notification => {
          notification.isRead = true;
        });
        state.unreadCount = 0;
      })
      
      // Delete notification
      .addCase(deleteNotification.fulfilled, (state, action) => {
        const deletedNotification = state.notifications.find(n => n._id === action.payload);
        if (deletedNotification && !deletedNotification.isRead) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications = state.notifications.filter(n => n._id !== action.payload);
      });
  }
});

export const { toggleNotifications, closeNotifications, addNotification } = notificationSlice.actions;

export const selectNotifications = (state) => state.notifications.notifications;
export const selectUnreadCount = (state) => state.notifications.unreadCount;
export const selectNotificationsStatus = (state) => state.notifications.status;
export const selectIsNotificationsOpen = (state) => state.notifications.isOpen;

export default notificationSlice.reducer; 