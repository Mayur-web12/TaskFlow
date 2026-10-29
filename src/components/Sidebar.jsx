import { NavLink } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  LayoutDashboard, FolderKanban, CheckSquare, Users, ChartNoAxesCombined,
  Settings, Sparkles, CircleHelp,
} from 'lucide-react';

const mainLinks = [
  { label: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
  { label: 'Projects', path: '/projects', icon: FolderKanban },
  { label: 'My Tasks', path: '/my-tasks', icon: CheckSquare },
  { label: 'Team', path: '/team', icon: Users },
  { label: 'Reports', path: '/reports', icon: ChartNoAxesCombined },
];

const Sidebar = ({ onNavigate, onClose }) => (
  <div>
    <aside className="sidebar">
      <button type="button" className="sidebar-close-button" onClick={onClose} aria-label="Close navigation">
        <X size={22} />
      </button>

      <div className="workspace-switcher">
        <div className="workspace-logo">
          <img src="/TaskFlowLogo.png" alt="TaskFlow logo" />
        </div>
      </div>

      <div className="sidebar-label">WORKSPACE</div>
      <nav className="sidebar-nav">
        {mainLinks.map(({ label, path, icon: Icon }) => (
          <NavLink key={path} to={path} onClick={onNavigate} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
            <Icon size={19} strokeWidth={1.8} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <NavLink to="/settings" onClick={onNavigate} className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}>
          <Settings size={19} /><span>Settings</span>
        </NavLink>

        <div className="upgrade-card">
          <div className="upgrade-icon"><Sparkles size={20} /></div>
          <strong>Work smarter</strong>
          <p>AI-powered productivity is coming soon.</p>
          <button type="button" disabled>Coming soon</button>
        </div>

        <NavLink to="/help-support" onClick={onNavigate} className={({ isActive }) => `help-link ${isActive ? 'active' : ''}`}>
          <CircleHelp size={18} /><span>Help &amp; Support</span>
        </NavLink>
      </div>
    </aside>
  </div>
);

export default Sidebar;
