import { useEffect, useState } from 'react';
import {
  Search, Bell, ChevronDown, Menu, UserRound, Settings, LogOut,
  CircleHelp, X, Check, CheckCheck, Trash2, FolderKanban, CheckSquare, Users,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getNotifications, saveNotifications } from '../utils/notifications';

const pageNames = {
  '/dashboard': 'Overview',
  '/projects': 'Projects',
  '/my-tasks': 'My Tasks',
  '/team': 'Team',
  '/reports': 'Reports',
  '/settings': 'Settings',
  '/profile': 'My Profile',
  '/notifications': 'Notifications',
  '/help-support': 'Help & Support',
};

const iconByType = { workspace: Users, task: CheckSquare, project: FolderKanban };

const Header = ({ toggleSidebar }) => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [notifications, setNotifications] = useState(getNotifications);
  const [toast, setToast] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = pageNames[location.pathname] || 'Overview';
  const unreadCount = notifications.filter((item) => !item.read).length;

  useEffect(() => {
    const syncNotifications = (event) => setNotifications(event.detail || getNotifications());
    window.addEventListener('taskflow-notifications-updated', syncNotifications);
    window.addEventListener('storage', syncNotifications);
    return () => {
      window.removeEventListener('taskflow-notifications-updated', syncNotifications);
      window.removeEventListener('storage', syncNotifications);
    };
  }, []);

  useEffect(() => {
    if (!toast) return undefined;
    const timer = window.setTimeout(() => setToast(''), 2600);
    return () => window.clearTimeout(timer);
  }, [toast]);

  const openPage = (path) => {
    setProfileOpen(false);
    setNotificationsOpen(false);
    setSearchOpen(false);
    navigate(path);
  };

  const markRead = (id) => {
    const selected = notifications.find((item) => item.id === id);
    if (!selected || selected.read) return;
    const updated = notifications.map((item) => item.id === id ? { ...item, read: true } : item);
    setNotifications(updated);
    saveNotifications(updated);
    setToast('Notification marked as read');
  };

  const deleteNotification = (id) => {
    const updated = notifications.filter((item) => item.id !== id);
    setNotifications(updated);
    saveNotifications(updated);
    setToast('Notification deleted');
  };

  const markAllRead = () => {
    if (!unreadCount) return;
    const updated = notifications.map((item) => ({ ...item, read: true }));
    setNotifications(updated);
    saveNotifications(updated);
    setToast('All notifications marked as read');
  };

  return (
    <header className="app-header">
      {toast && (
        <div className="taskflow-toast taskflow-toast--header" role="status" aria-live="polite">
          <CheckCheck size={18} />
          <span>{toast}</span>
          <button type="button" onClick={() => setToast('')} aria-label="Dismiss message"><X size={16} /></button>
        </div>
      )}

      <button type="button" className="menu-toggle" onClick={toggleSidebar} aria-label="Toggle sidebar">
        <Menu size={22} />
      </button>

      <div className="breadcrumb">
        <span className="breadcrumb-workspace">Workspace</span>
        <span className="breadcrumb-divider">/</span>
        <strong>{currentPage}</strong>
      </div>

      <div className="header-actions">
        <button
          type="button"
          className="icon-button mobile-search-button"
          onClick={() => setSearchOpen((prev) => !prev)}
          aria-label={searchOpen ? 'Close search' : 'Open search'}
        >{searchOpen ? <X size={20} /> : <Search size={20} />}</button>

        <label className="header-search desktop-search">
          <Search size={18} />
          <input
            type="search"
            placeholder="Search anything..."
            aria-label="Search TaskFlow"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button type="button" className="search-clear" onClick={() => setQuery('')} aria-label="Clear search">
              <X size={15} />
            </button>
          )}
        </label>

        <div className="notification-wrapper">
          <button
            type="button"
            className="icon-button notification-button"
            onClick={() => { setNotificationsOpen((prev) => !prev); setProfileOpen(false); }}
            aria-label={`Notifications${unreadCount ? `, ${unreadCount} unread` : ''}`}
            aria-expanded={notificationsOpen}
          >
            <Bell size={20} />
            {unreadCount > 0 && <span className="notification-badge">{unreadCount > 9 ? '9+' : unreadCount}</span>}
          </button>

          {notificationsOpen && (
            <div className="notification-panel">
              <div className="notification-panel-header">
                <strong>Notifications</strong>
                {unreadCount > 0 && (
                  <button type="button" className="text-button" onClick={markAllRead}>Mark all read</button>
                )}
              </div>
              <div className="notification-preview-list">
                {notifications.length === 0 ? (
                  <p className="notification-panel-empty">You're all caught up!</p>
                ) : notifications.slice(0, 4).map((item) => {
                  const Icon = iconByType[item.type] || Bell;
                  return (
                    <div className={`notification-preview ${item.read ? 'is-read' : 'is-unread'}`} key={item.id}>
                      <span className="notification-preview-icon"><Icon size={17} /></span>
                      <button type="button" className="notification-preview-content" onClick={() => openPage('/notifications')}>
                        <strong>{item.title}</strong>
                        <span>{item.message}</span>
                      </button>
                      <div className="notification-preview-actions">
                        {!item.read && <button type="button" onClick={() => markRead(item.id)} aria-label="Mark as read" title="Mark as read"><Check size={15} /></button>}
                        <button type="button" onClick={() => deleteNotification(item.id)} aria-label="Delete notification" title="Delete notification"><Trash2 size={15} /></button>
                      </div>
                    </div>
                  );
                })}
              </div>
              <button type="button" className="notification-view-all" onClick={() => openPage('/notifications')}>
                View all notifications
              </button>
            </div>
          )}
        </div>

        <div className="profile-menu-wrapper">
          <button
            type="button"
            className="header-profile profile-trigger"
            onClick={() => { setProfileOpen((prev) => !prev); setNotificationsOpen(false); }}
            aria-expanded={profileOpen}
            aria-label="Open profile menu"
          >
            <div className="avatar">M</div>
            <div className="profile-details"><strong>Mayur</strong><span>Developer</span></div>
            <ChevronDown size={16} />
          </button>

          {profileOpen && (
            <div className="header-dropdown">
              <button type="button" onClick={() => openPage('/profile')}><UserRound size={17} />My Profile</button>
              <button type="button" onClick={() => openPage('/settings')}><Settings size={17} />Settings</button>
              <button type="button" onClick={() => openPage('/help-support')}><CircleHelp size={17} />Help &amp; Support</button>
              <button type="button" onClick={() => { setProfileOpen(false); alert('Sign out will be available after authentication is connected.'); }}>
                <LogOut size={17} />Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      {searchOpen && (
        <div className="mobile-search-panel">
          <Search size={18} />
          <input
            autoFocus
            type="search"
            placeholder="Search projects and tasks..."
            aria-label="Search projects and tasks"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
        </div>
      )}
    </header>
  );
};

export default Header;
