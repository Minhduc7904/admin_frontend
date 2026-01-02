// Helper function to show notifications
import { store } from '../../core/store';
import { addNotification } from '../../features/notification/store/notificationSlice';

export const notify = {
  success: (message, title = '') => {
    store.dispatch(addNotification({ type: 'success', message, title, autoHide: true }));
  },
  error: (message, title = '') => {
    store.dispatch(addNotification({ type: 'error', message, title, autoHide: false }));
  },
  warning: (message, title = '') => {
    store.dispatch(addNotification({ type: 'warning', message, title, autoHide: false }));
  },
  info: (message, title = '') => {
    store.dispatch(addNotification({ type: 'info', message, title, autoHide: false }));
  },
};
