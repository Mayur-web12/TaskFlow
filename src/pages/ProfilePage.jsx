import { useState } from 'react';
import { Save } from 'lucide-react';
import Input from '../components/common/Input';
import Button from '../components/common/Button';

const SETTINGS_STORAGE_KEY = 'taskflow-settings';

const getInitialProfile = () => {
  try {
    const settings = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
    return settings.profile || {
      name: 'Mayur',
      email: 'mayur@example.com',
      jobTitle: 'Frontend Developer',
      bio: '',
    };
  } catch {
    return { name: 'Mayur', email: 'mayur@example.com', jobTitle: 'Frontend Developer', bio: '' };
  }
};

const ProfilePage = () => {
  const [profile, setProfile] = useState(getInitialProfile);
  const [message, setMessage] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setProfile((current) => ({ ...current, [name]: value }));
    setMessage('');
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    try {
      const existing = JSON.parse(localStorage.getItem(SETTINGS_STORAGE_KEY) || '{}');
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify({
        ...existing,
        profile: { ...profile },
      }));
      setMessage('Profile saved in this browser.');
    } catch (error) {
      console.error('Could not save profile:', error);
      setMessage('Could not save your profile in this browser.');
    }
  };

  return (
    <div className="page-content profile-page">
      <div className="welcome-section">
        <div>
          <div className="eyebrow">YOUR ACCOUNT</div>
          <h1>My Profile</h1>
          <p>View and edit your personal information.</p>
        </div>
      </div>

      <section className="profile-card">
        <div className="profile-card-heading">
          <div className="profile-large-avatar">{profile.name.trim().charAt(0).toUpperCase() || 'U'}</div>
          <div><h2>{profile.name || 'Your name'}</h2><p>{profile.jobTitle || 'Add your job title'}</p></div>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="profile-form-grid">
            <Input label="Full name" name="name" value={profile.name} onChange={handleChange} placeholder="Enter your name" required />
            <Input label="Email address" name="email" type="email" value={profile.email} onChange={handleChange} placeholder="Enter your email" required />
            <Input label="Job title" name="jobTitle" value={profile.jobTitle} onChange={handleChange} placeholder="Enter your job title" />
            <div className="profile-bio-field">
              <label htmlFor="profile-bio">About me</label>
              <textarea id="profile-bio" name="bio" value={profile.bio || ''} onChange={handleChange} placeholder="Write a short introduction..." rows={4} />
            </div>
          </div>
          <div className="profile-save-row">
            {message && <p role="status">{message}</p>}
            <Button type="submit"><Save size={17} />Save Profile</Button>
          </div>
        </form>
      </section>
    </div>
  );
};

export default ProfilePage;
