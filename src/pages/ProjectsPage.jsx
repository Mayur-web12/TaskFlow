
import { useState } from 'react';
import {
  Search,
  Plus,
  FolderKanban,
  CalendarDays,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';


const initialProjects = [
  {
    id: 1,
    name: 'Website Redesign',
    description: 'Redesign the company website.',
    status: 'Active',
    dueDate: '2026-11-15',
    progress: 75,
  },
  {
    id: 2,
    name: 'Mobile Application',
    description: 'Build the customer mobile app.',
    status: 'Active',
    dueDate: '2026-11-25',
    progress: 45,
  },
  {
    id: 3,
    name: 'Admin Dashboard',
    description: 'Internal tools and analytics.',
    status: 'Completed',
    dueDate: '2026-10-10',
    progress: 100,
  },
];

const PROJECT_STATUSES = ['Active', 'Completed', 'Archived'];

function formatDueDate(dueDate) {
  if (!dueDate) return 'No due date';

  // Noon avoids date shifts caused by timezone conversions.
  return new Date(`${dueDate}T12:00:00`).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export default function ProjectsPage() {
  const [projects, setProjects] = useState(initialProjects);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [showForm, setShowForm] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    dueDate: '',
    status: 'Active',
  });

  const filteredProjects = projects.filter((project) => {
    const searchText = search.trim().toLowerCase();
    const matchesSearch =
      project.name.toLowerCase().includes(searchText) ||
      project.description.toLowerCase().includes(searchText);

    const matchesFilter = filter === 'All' || project.status === filter;
    return matchesSearch && matchesFilter;
  });

  function handleInputChange(event) {
    const { name, value } = event.target;
    setFormData((previousData) => ({
      ...previousData,
      [name]: value,
    }));
  }

  function closeForm() {
    setShowForm(false);
    setFormData({
      name: '',
      description: '',
      dueDate: '',
      status: 'Active',
    });
  }

  function handleCreateProject(event) {
    event.preventDefault();

    const name = formData.name.trim();
    if (!name) return;

    const newProject = {
      id: Date.now(),
      name,
      description: formData.description.trim(),
      dueDate: formData.dueDate,
      status: formData.status,
      progress: formData.status === 'Completed' ? 100 : 0,
    };

    setProjects((previousProjects) => [newProject, ...previousProjects]);
    setFilter('All');
    setSearch('');
    closeForm();
  }

  function handleDeleteProject(projectId) {
    const confirmed = window.confirm(
      'Are you sure you want to delete this project?'
    );

    if (!confirmed) return;

    setProjects((previousProjects) =>
      previousProjects.filter((project) => project.id !== projectId)
    );
    setOpenMenuId(null);
  }

  return (
    <div className="page-content projects-page">
      <div className="welcome-section projects-heading">
        <div>
          <div className="eyebrow">TASKFLOW WORKSPACE</div>
          <h1>Projects</h1>
          <p>Organize your work and track your team's progress.</p>
        </div>

        <Button
          type="button"
          variant="primary"
          onClick={() => setShowForm(true)}
        >
          <Plus size={18} aria-hidden="true" />
          Create project
        </Button>
      </div>

      <div className="projects-toolbar">
        <div className="projects-search">
          <Search size={18} aria-hidden="true" />

          <Input
            type="search"
            name="projectSearch"
            placeholder="Search projects..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search projects"
          />
        </div>

        <div className="project-filters" aria-label="Filter projects by status">
          {['All', ...PROJECT_STATUSES].map((status) => (
            <button
              type="button"
              key={status}
              className={
                filter === status ? 'filter-button selected' : 'filter-button'
              }
              aria-pressed={filter === status}
              onClick={() => setFilter(status)}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="projects-count" aria-live="polite">
        {filteredProjects.length}{' '}
        {filteredProjects.length === 1 ? 'project' : 'projects'}
      </div>

      {filteredProjects.length > 0 ? (
        <div className="projects-grid">
          {filteredProjects.map((project) => (
            <article className="project-card" key={project.id}>
              {/* Card header: project icon on the left, actions on the right. */}
              <div className="project-card-top">
                <div className="project-icon" aria-hidden="true">
                  <FolderKanban size={21} />
                </div>

                <div className="project-menu-wrapper">
                  <button
                    type="button"
                    className="project-menu-trigger"
                    aria-label={`Project actions for ${project.name}`}
                    aria-expanded={openMenuId === project.id}
                    aria-haspopup="menu"
                    onClick={() =>
                      setOpenMenuId((currentId) =>
                        currentId === project.id ? null : project.id
                      )
                    }
                  >
                    <MoreHorizontal size={21} aria-hidden="true" />
                  </button>

                  {openMenuId === project.id && (
                    <div className="project-menu" role="menu">
                      <button
                        type="button"
                        role="menuitem"
                        className="delete-project-button"
                        onClick={() => handleDeleteProject(project.id)}
                      >
                        <Trash2 size={15} aria-hidden="true" />
                        Delete project
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="project-title-row">
                <h2>{project.name}</h2>
                <span
                  className={`project-status status-${project.status.toLowerCase()}`}
                >
                  {project.status}
                </span>
              </div>

              <p className="project-description">
                {project.description || 'No description provided.'}
              </p>

              <div className="project-progress-heading">
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
                  className="progress-fill"
                  style={{ width: `${project.progress}%` }}
                />
              </div>

              <div className="project-due-date">
                <CalendarDays size={16} aria-hidden="true" />
                <span>{formatDueDate(project.dueDate)}</span>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="projects-empty-state">
          <FolderKanban size={36} aria-hidden="true" />
          <h2>No projects found</h2>
          <p>
            Try a different search, change the filter, or create a project.
          </p>
          <Button
            type="button"
            variant="primary"
            onClick={() => setShowForm(true)}
          >
            <Plus size={18} aria-hidden="true" />
            Create project
          </Button>
        </div>
      )}

      {showForm && (

        <Modal
          open={showForm}
          onClose={closeForm}
          title="Create project"
          description="Add a new project to your workspace."
        >
          <form onSubmit={handleCreateProject}>
            <Input
              label="Project name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              placeholder="e.g. Customer Portal"
              required
              maxLength={100}
            />

            <Input
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="What is this project about?"
            />

            <Input
              label="Due date"
              name="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={handleInputChange}
            />

            <label htmlFor="project-status">Status</label>
            <select
              id="project-status"
              name="status"
              value={formData.status}
              onChange={handleInputChange}
            >
              {PROJECT_STATUSES.map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </select>

            <Input
              label="Due date"
              name="dueDate"
              inputType="date"
              value={formData.dueDate}
              onChange={(value) =>
                setFormData((previous) => ({
                  ...previous,
                  dueDate: value,
                }))
              }
            />

            <div className="modal-actions">
              <Button
                type="button"
                variant="secondary"
                onClick={closeForm}
              >
                Cancel
              </Button>

              <Button type="submit" variant="primary">
                Add project
              </Button>
            </div>
          </form>
        </Modal>

      )}
    </div>
  );
}
