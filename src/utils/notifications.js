const STORAGE_KEY = 'taskflow-notifications';

export const initialNotifications = [
  {
    id: 1,
    title: 'Welcome to TaskFlow',
    message: 'Your workspace is ready to use.',
    time: 'Just now',
    type: 'workspace',
    read: false,
  },
  {
    id: 2,
    title: 'Task reminder',
    message: 'Review your pending tasks.',
    time: 'Earlier',
    type: 'task',
    read: false,
  },
  {
    id: 3,
    title: 'Project update',
    message: 'Check the latest progress in Projects.',
    time: 'Earlier',
    type: 'project',
    read: true,
  },
];

export function getNotifications() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored !== null) return JSON.parse(stored);
  } catch (error) {
    console.error('Could not load TaskFlow notifications:', error);
  }
  return initialNotifications;
}

export function saveNotifications(notifications) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(notifications));
    // Custom event synchronizes components in the same browser tab.
    window.dispatchEvent(new CustomEvent('taskflow-notifications-updated', {
      detail: notifications,
    }));
  } catch (error) {
    console.error('Could not save TaskFlow notifications:', error);
  }
}
