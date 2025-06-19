import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  sidebar: {
    open: true,
    mobileOpen: false,
  },
  notification: {
    open: false,
    message: '',
    type: 'info', // 'success', 'error', 'warning', 'info'
  },
  confirmDialog: {
    open: false,
    title: '',
    message: '',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmAction: null,
  },
  theme: localStorage.getItem('theme') || 'light',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    // Sidebar actions
    toggleSidebar: (state) => {
      state.sidebar.open = !state.sidebar.open;
    },
    toggleMobileSidebar: (state) => {
      state.sidebar.mobileOpen = !state.sidebar.mobileOpen;
    },
    closeMobileSidebar: (state) => {
      state.sidebar.mobileOpen = false;
    },
    
    // Notification actions
    showNotification: (state, action) => {
      state.notification.open = true;
      state.notification.message = action.payload.message;
      state.notification.type = action.payload.type || 'info';
    },
    hideNotification: (state) => {
      state.notification.open = false;
    },
    
    // Confirm dialog actions
    showConfirmDialog: (state, action) => {
      state.confirmDialog.open = true;
      state.confirmDialog.title = action.payload.title || 'Confirm';
      state.confirmDialog.message = action.payload.message || 'Are you sure?';
      state.confirmDialog.confirmText = action.payload.confirmText || 'Confirm';
      state.confirmDialog.cancelText = action.payload.cancelText || 'Cancel';
      state.confirmDialog.confirmAction = action.payload.confirmAction;
    },
    hideConfirmDialog: (state) => {
      state.confirmDialog.open = false;
    },
    
    // Theme actions
    toggleTheme: (state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('theme', newTheme);
      state.theme = newTheme;
    },
  },
});

export const {
  toggleSidebar,
  toggleMobileSidebar,
  closeMobileSidebar,
  showNotification,
  hideNotification,
  showConfirmDialog,
  hideConfirmDialog,
  toggleTheme,
} = uiSlice.actions;

export default uiSlice.reducer;