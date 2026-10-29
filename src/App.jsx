
import { useState } from 'react';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
} from 'react-router-dom';

import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DashboardPage from './pages/DashboardPage';
import ProjectsPage from './pages/ProjectsPage';
import MyTasksPage from './pages/MyTasksPage';
import TeamPage from './pages/TeamPage';

import './App.css';
import ReportsPage from './pages/ReportsPage';
import SettingsPage from './pages/SettingsPage';
import HelpSupportPage from './pages/HelpSupportPage';
import NotificationsPage from './pages/NotificationsPage';
import ProfilePage from './pages/ProfilePage';

function PlaceholderPage({ title }) {
  return (
    <div className="page-content">
      <div className="welcome-section">
        <div>
          <div className="eyebrow">TASKFLOW WORKSPACE</div>
          <h1>{title}</h1>
          <p>We will build this feature step by step.</p>
        </div>
      </div>

      <div className="placeholder-card">
        <div className="placeholder-icon">🚧</div>
        <h2>{title} page is coming soon</h2>
        <p>
          This page will become functional as we continue building
          TaskFlow.
        </p>
      </div>
    </div>
  );
}

function App() {
  const location = useLocation();

  const pageTitles = {
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

  const title = pageTitles[location.pathname] || 'Overview';
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };


  return (
    <>
      <div>

        <div className="app-shell">
          {sidebarOpen && (
            <button
              className="mobile-overlay"
              aria-label="Close navigation"
              onClick={() => setSidebarOpen(false)}
            />
          )}

          <div className={sidebarOpen ? 'sidebar-open' : ''}>
            <Sidebar
              onNavigate={() => setSidebarOpen(false)}
              onClose={() => setSidebarOpen(false)}
            />
          </div>

          <div className="main-panel">
            <Header toggleSidebar={toggleSidebar} />
            <main>
              <Routes>
                <Route
                  path="/"
                  element={<Navigate to="/dashboard" replace />}
                />

                <Route
                  path="/dashboard"
                  element={<DashboardPage />}
                />

                <Route
                  path="/projects"
                  element={<ProjectsPage />}
                />

                <Route
                  path="/my-tasks"
                  element={<MyTasksPage />}
                />

                <Route
                  path="/team"
                  element={<TeamPage />}
                />

                <Route
                  path="/reports"
                  element={<ReportsPage />}
                />

                <Route
                  path="/settings"
                  element={<SettingsPage />}
                />

                <Route
                  path="/notifications"
                  element={<NotificationsPage />}
                />

                <Route
                  path="/profile"
                  element={<ProfilePage />}
                />

                <Route
                  path="/help-support"
                  element={<HelpSupportPage />}
                />


                <Route
                  path="*"
                  element={<Navigate to="/dashboard" replace />}
                />
              </Routes>
            </main>
          </div>
        </div>
      </div>

    </>
  )
}

export default App
