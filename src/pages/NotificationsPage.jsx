import { useEffect, useState } from 'react';
import {
  Bell,
  CheckCheck,
  Check,
  Trash2,
  FolderKanban,
  CheckSquare,
  Users,
  X,
} from 'lucide-react';
import { getNotifications, saveNotifications } from '../utils/notifications';

const iconByType = {
  workspace: Users,
  task: CheckSquare,
  project: FolderKanban,
};

const NotificationsPage = () => {
  const [notifications, setNotifications] = useState(getNotifications);
  const [toast, setToast] = useState('');

  useEffect(() => {
    const syncNotifications = (event) => {
      setNotifications(event.detail || getNotifications());
    };
    window.addEventListener('taskflow-notifications-updated', syncNotifications);
    window.addEventListener('storage', syncNotifications);
    return () => {
      window.removeEventListener('taskflow-notifications-updated', syncNotifications);
      window.removeEventListener('storage', syncNotifications);
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2800);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const updateNotifications = (nextNotifications) => {
    setNotifications(nextNotifications);
    saveNotifications(nextNotifications);
  };

  const markAllRead = () => {
    const unreadCount = notifications.filter((item) => !item.read).length;
    if (!unreadCount) return;
    updateNotifications(notifications.map((item) => ({ ...item, read: true })));
    setToast('All notifications marked as read');
  };

  const markRead = (id) => {
    const selected = notifications.find((item) => item.id === id);
    if (!selected || selected.read) return;
    updateNotifications(
      notifications.map((item) => item.id === id ? { ...item, read: true } : item)
    );
    setToast('Notification marked as read');
  };

  const deleteNotification = (id) => {
    updateNotifications(notifications.filter((item) => item.id !== id));
    setToast('Notification deleted');
  };

  const unreadCount = notifications.filter((item) => !item.read).length;

  return (
    <div className="page-content notifications-page">
      {toast && (
        <div className="taskflow-toast" role="status" aria-live="polite">
          <CheckCheck size={18} />
          <span>{toast}</span>
          <button type="button" onClick={() => setToast('')} aria-label="Dismiss message">
            <X size={16} />
          </button>
        </div>
      )}

      <div className="welcome-section">
        <div>
          <div className="eyebrow">TASKFLOW WORKSPACE</div>
          <h1>Notifications</h1>
          <p>Stay up to date with your workspace activity.</p>
        </div>
        {unreadCount > 0 && (
          <button type="button" className="notifications-mark-all" onClick={markAllRead}>
            <CheckCheck size={17} />
            Mark all as read
          </button>
        )}
      </div>

      <div className="notifications-summary">
        <Bell size={20} />
        <span>
          {unreadCount === 0
            ? 'You are all caught up!'
            : `You have ${unreadCount} unread notification${unreadCount === 1 ? '' : 's'}.`}
        </span>
      </div>

      <section className="notifications-list">
        {notifications.length === 0 ? (
          <div className="notifications-empty">
            <div className='text-center'>
              <Bell size={32} />
            </div>
            <h2>No notifications</h2>
            <p>New updates will appear here.</p>
          </div>
        ) : notifications.map((notification) => {
          const Icon = iconByType[notification.type] || Bell;
          return (
            <article
              className={`notification-item ${notification.read ? 'is-read' : 'is-unread'}`}
              key={notification.id}
            >
              <div className="notification-item-icon"><Icon size={21} /></div>
              <div className="notification-item-content">
                <div className="notification-item-heading">
                  <h3>{notification.title}</h3>
                  {!notification.read && <span className="notification-unread-dot" />}
                </div>
                <p>{notification.message}</p>
                <span className="notification-time">{notification.time}</span>
              </div>
              <div className="notification-item-actions">
                {!notification.read && (
                  <button
                    type="button"
                    onClick={() => markRead(notification.id)}
                    aria-label={`Mark ${notification.title} as read`}
                    title="Mark as read"
                  ><Check size={17} /></button>
                )}
                <button
                  type="button"
                  onClick={() => deleteNotification(notification.id)}
                  aria-label={`Delete ${notification.title}`}
                  title="Delete notification"
                ><Trash2 size={17} /></button>
              </div>
            </article>
          );
        })}
      </section>
    </div>
  );
};

export default NotificationsPage;
