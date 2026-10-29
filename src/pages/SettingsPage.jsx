import { useState } from 'react';
import {
  Bell, Palette, ShieldCheck, Save, Mail, BriefcaseBusiness,
  LockKeyhole, CheckCircle2,
} from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const SETTINGS_STORAGE_KEY = 'taskflow-settings';

const getInitialSettings = () => {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || 'null');
    if (stored) return stored;
  } catch (error) {
    console.error('Could not load TaskFlow settings:', error);
  }
  return {
    profile: { name: 'Mayur', email: 'mayur@example.com', jobTitle: 'Frontend Developer', bio: '' },
    notifications: { emailUpdates: true, taskReminders: true, projectUpdates: false },
    appearance: 'light',
  };
};

const SettingsPage = () => {
  const [initialSettings] = useState(getInitialSettings);
  const [notifications, setNotifications] = useState(initialSettings.notifications);
  const [appearance, setAppearance] = useState(initialSettings.appearance);
  const [saved, setSaved] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState('');

  const handleNotificationChange = (key) => {
    setNotifications((current) => ({ ...current, [key]: !current[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    try {
      const existing = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
        ...existing,
        notifications,
        appearance,
      }));
      setSaved(true);
    } catch (error) {
      console.error('Could not save TaskFlow settings:', error);
      setSaved(false);
      alert('Settings could not be saved in this browser.');
    }
  };

  const handlePasswordSubmit = (event) => {
    event.preventDefault();
    setPasswordMessage('Password changes are not connected yet. Connect an authentication backend to enable this feature.');
  };

  return (
    <div className="page-content settings-page">
      <div className="welcome-section settings-heading">
        <div>
          <span className="eyebrow">PREFERENCES</span>
          <h1>Settings</h1>
          <p>Manage your notification preferences, appearance, and account security.</p>
        </div>
      </div>

      {saved && (
        <div className="settings-success" role="status">
          <CheckCircle2 size={19} />
          <span>Settings saved in this browser.</span>
        </div>
      )}

      <section className="settings-card">
        <div className="settings-card__heading">
          <div className="settings-section-icon settings-section-icon--blue"><Bell size={21} /></div>
          <div><h2>Notifications</h2><p>Choose which updates you want to receive.</p></div>
        </div>
        <div className="settings-options">
          <div className="settings-option">
            <div className="settings-option__icon"><Mail size={19} /></div>
            <div className="settings-option__text"><strong>Email notifications</strong><p>Receive important updates by email.</p></div>
            <label className="settings-toggle"><input type="checkbox" checked={notifications.emailUpdates} onChange={() => handleNotificationChange('emailUpdates')} aria-label="Email notifications" /><span className="settings-toggle__track" /></label>
          </div>
          <div className="settings-option">
            <div className="settings-option__icon"><CheckCircle2 size={19} /></div>
            <div className="settings-option__text"><strong>Task reminders</strong><p>Get reminders about your pending tasks.</p></div>
            <label className="settings-toggle"><input type="checkbox" checked={notifications.taskReminders} onChange={() => handleNotificationChange('taskReminders')} aria-label="Task reminders" /><span className="settings-toggle__track" /></label>
          </div>
          <div className="settings-option">
            <div className="settings-option__icon"><BriefcaseBusiness size={19} /></div>
            <div className="settings-option__text"><strong>Project updates</strong><p>Stay informed about project changes.</p></div>
            <label className="settings-toggle"><input type="checkbox" checked={notifications.projectUpdates} onChange={() => handleNotificationChange('projectUpdates')} aria-label="Project updates" /><span className="settings-toggle__track" /></label>
          </div>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card__heading">
          <div className="settings-section-icon settings-section-icon--orange"><Palette size={21} /></div>
          <div><h2>Appearance</h2><p>Choose how TaskFlow looks on your device.</p></div>
        </div>
        <div className="settings-appearance">
          <label htmlFor="settings-theme">Color theme</label>
          <select id="settings-theme" value={appearance} onChange={(event) => { setAppearance(event.target.value); setSaved(false); }}>
            <option value="light">Light mode</option>
            <option value="dark">Dark mode (preference only)</option>
            <option value="system">System preference (selection only)</option>
          </select>
          <p>The theme choice is saved in this browser, but dark mode and system theme switching are not applied across the app yet.</p>
        </div>
      </section>

      <section className="settings-card">
        <div className="settings-card__heading">
          <div className="settings-section-icon settings-section-icon--green"><ShieldCheck size={21} /></div>
          <div><h2>Security</h2><p>Manage your account security options.</p></div>
        </div>
        <div className="settings-security-row">
          <div className="settings-option__icon"><LockKeyhole size={20} /></div>
          <div className="settings-option__text"><strong>Password</strong><p>Changing your real password requires an authentication backend.</p></div>
          <Button type="button" variant="secondary" onClick={() => { setShowPasswordForm((current) => !current); setPasswordMessage(''); }}>
            {showPasswordForm ? 'Cancel' : 'Change password'}
          </Button>
        </div>
        {showPasswordForm && (
          <form className="settings-password-form" onSubmit={handlePasswordSubmit}>
            <Input label="Current password" name="currentPassword" type="password" placeholder="Enter current password" autoComplete="current-password" required />
            <Input label="New password" name="newPassword" type="password" placeholder="Enter new password" autoComplete="new-password" minLength={8} required />
            <Button type="submit" variant="secondary">Continue</Button>
            {passwordMessage && <p className="settings-info-message" role="status">{passwordMessage}</p>}
          </form>
        )}
      </section>

      <div className="settings-save-bar">
        <p>Save your preferences in this browser.</p>
        <Button type="button" onClick={handleSave}><Save size={17} />Save Settings</Button>
      </div>
    </div>
  );
};

export default SettingsPage;
