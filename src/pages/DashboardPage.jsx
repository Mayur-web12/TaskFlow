// import React from 'react'

import {
  FolderKanban,
  CheckCircle2,
  Clock3,
  AlertCircle,
  Plus,
  ArrowUpRight,
  CalendarDays,
  MoreHorizontal,
} from 'lucide-react';

const stats = [
  {
    label: 'Total Projects',
    value: '08',
    note: 'Across your workspace',
    icon: FolderKanban,
    color: 'purple',
  },
  {
    label: 'Completed Tasks',
    value: '24',
    note: 'Great progress this week',
    icon: CheckCircle2,
    color: 'green',
  },
  {
    label: 'In Progress',
    value: '12',
    note: 'Tasks being worked on',
    icon: Clock3,
    color: 'orange',
  },
  {
    label: 'Overdue Tasks',
    value: '03',
    note: 'Need your attention',
    icon: AlertCircle,
    color: 'red',
  },
];

const projects = [
  {
    name: 'Website Redesign',
    description: 'Redesign the company website',
    progress: 75,
    tasks: '12/16 tasks',
    color: 'purple',
    initials: ['M', 'R', 'P'],
  },
  {
    name: 'Mobile Application',
    description: 'Build the customer mobile app',
    progress: 45,
    tasks: '9/20 tasks',
    color: 'blue',
    initials: ['A', 'M'],
  },
  {
    name: 'Admin Dashboard',
    description: 'Internal tools and analytics',
    progress: 90,
    tasks: '18/20 tasks',
    color: 'green',
    initials: ['R', 'P', 'M'],
  },
];

const tasks = [
  {
    title: 'Create responsive homepage',
    project: 'Website Redesign',
    priority: 'High',
    status: 'In Progress',
    due: 'Today',
    color: 'red',
  },
  {
    title: 'Connect login API',
    project: 'Admin Dashboard',
    priority: 'Medium',
    status: 'Review',
    due: 'Tomorrow',
    color: 'orange',
  },
  {
    title: 'Design mobile navigation',
    project: 'Mobile Application',
    priority: 'Low',
    status: 'Todo',
    due: 'Oct 24',
    color: 'blue',
  },
];


const DashboardPage = () => {
  return (
    <div className="page-content">
      <section className="welcome-section">
        <div>
          <div className="eyebrow">MONDAY, OCTOBER 20</div>
          <h1>Good morning, Mayur</h1>
          <p>Here is what's happening with your projects today.</p>
        </div>

        <button className="primary-button" type="button">
          <Plus size={18} />
          Create project
        </button>
      </section>

      <section className="stats-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article className="stat-card" key={stat.label}>
              <div className="stat-top">
                <span>{stat.label}</span>
                <div className={`stat-icon ${stat.color}`}>
                  <Icon size={20} />
                </div>
              </div>

              <h2>{stat.value}</h2>
              <p>{stat.note}</p>
            </article>
          );
        })}
      </section>

      <section className="section-block">
        <div className="section-heading">
          <div>
            <h2>Recent projects</h2>
            <p>Keep track of your team's ongoing work.</p>
          </div>

          <button className="text-button" type="button">
            View all <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="projects-grid">
          {projects.map((project) => (
            <article className="project-card" key={project.name}>
              <div className="project-card-top">
                <div className={`project-symbol ${project.color}`}>
                  <FolderKanban size={21} />
                </div>

                <button
                  className="icon-button"
                  type="button"
                  aria-label={`Options for ${project.name}`}
                >
                  <MoreHorizontal size={20} />
                </button>
              </div>

              <h3>{project.name}</h3>
              <p className="project-description">
                {project.description}
              </p>

              <div className="progress-label">
                <span>Progress</span>
                <strong>{project.progress}%</strong>
              </div>

              <div
                className="progress-track"
                role="progressbar"
                aria-label={`${project.name} progress`}
                aria-valuenow={project.progress}
                aria-valuemin={0}
                aria-valuemax={100}
              >
                <div
                  className={`progress-fill ${project.color}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <div className="project-card-footer">
                <div className="avatar-stack">
                  {project.initials.map((initial, index) => (
                    <span className="mini-avatar" key={`${initial}-${index}`}>
                      {initial}
                    </span>
                  ))}
                </div>

                <span>{project.tasks}</span>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section-block task-section">
        <div className="section-heading">
          <div>
            <h2>My tasks</h2>
            <p>Tasks that need your attention.</p>
          </div>

          <button className="text-button" type="button">
            View all <ArrowUpRight size={16} />
          </button>
        </div>

        <div className="task-table-wrapper">
          <table className="task-table">
            <thead>
              <tr>
                <th>Task</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Due date</th>
              </tr>
            </thead>

            <tbody>
              {tasks.map((task) => (
                <tr key={task.title}>
                  <td>
                    <div className="task-name">{task.title}</div>
                    <div className="task-project">{task.project}</div>
                  </td>

                  <td>
                    <span className={`priority ${task.color}`}>
                      {task.priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`status-badge ${task.status
                        .toLowerCase()
                        .replace(' ', '-')}`}
                    >
                      {task.status}
                    </span>
                  </td>

                  <td>
                    <span className="due-date">
                      <CalendarDays size={15} />
                      {task.due}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <p className="demo-notice">
        Demo data only · Your real projects will be connected to MongoDB later.
      </p>
    </div>
  )
}

export default DashboardPage