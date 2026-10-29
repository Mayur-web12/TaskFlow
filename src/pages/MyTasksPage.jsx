
import { useMemo, useState } from 'react';
import {
    CalendarDays,
    CheckCircle2,
    Circle,
    Clock3,
    ListTodo,
    Plus,
    Search,
    Trash2,
} from 'lucide-react';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

const initialTasks = [
    {
        id: 1,
        title: 'Finalize website homepage',
        description: 'Review the homepage layout and responsive design.',
        project: 'Website Redesign',
        priority: 'High',
        status: 'In Progress',
        dueDate: '2026-11-15',
    },
    {
        id: 2,
        title: 'Design mobile app screens',
        description: 'Prepare the main screens for the mobile application.',
        project: 'Mobile Application',
        priority: 'Medium',
        status: 'To Do',
        dueDate: '2026-11-25',
    },
    {
        id: 3,
        title: 'Review dashboard analytics',
        description: 'Check the dashboard cards and analytics layout.',
        project: 'Admin Dashboard',
        priority: 'Low',
        status: 'Completed',
        dueDate: '2026-10-10',
    },
];

const emptyForm = {
    title: '',
    description: '',
    project: 'Website Redesign',
    priority: 'Medium',
    status: 'To Do',
    dueDate: '',
};

const statusOptions = ['All', 'To Do', 'In Progress', 'Completed'];
const priorityOptions = ['Low', 'Medium', 'High'];

function formatDate(date) {
    if (!date) return 'No due date';

    return new Date(`${date}T00:00:00`).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
}

function MyTasksPage() {
    const [tasks, setTasks] = useState(initialTasks);
    const [search, setSearch] = useState('');
    const [activeStatus, setActiveStatus] = useState('All');
    const [activePriority, setActivePriority] = useState('All');
    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState(emptyForm);
    const [formError, setFormError] = useState('');

    const filteredTasks = useMemo(() => {
        const query = search.trim().toLowerCase();

        return tasks.filter((task) => {
            const matchesSearch =
                task.title.toLowerCase().includes(query) ||
                task.description.toLowerCase().includes(query) ||
                task.project.toLowerCase().includes(query);

            const matchesStatus =
                activeStatus === 'All' || task.status === activeStatus;

            const matchesPriority =
                activePriority === 'All' || task.priority === activePriority;

            return matchesSearch && matchesStatus && matchesPriority;
        });
    }, [tasks, search, activeStatus, activePriority]);

    const completedCount = tasks.filter(
        (task) => task.status === 'Completed'
    ).length;

    const inProgressCount = tasks.filter(
        (task) => task.status === 'In Progress'
    ).length;

    const todoCount = tasks.filter(
        (task) => task.status === 'To Do'
    ).length;

    const openCreateForm = () => {
        setFormData(emptyForm);
        setFormError('');
        setShowForm(true);
    };

    const closeCreateForm = () => {
        setShowForm(false);
        setFormError('');
    };

    const handleInputChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (name === 'title') {
            setFormError('');
        }
    };

    const handleCreateTask = (event) => {
        event.preventDefault();

        const title = formData.title.trim();

        if (!title) {
            setFormError('Please enter a task title.');
            return;
        }

        const newTask = {
            ...formData,
            title,
            description: formData.description.trim(),
            id: Date.now(),
        };

        setTasks((previous) => [newTask, ...previous]);
        closeCreateForm();
    };

    const handleStatusChange = (taskId, newStatus) => {
        setTasks((previous) =>
            previous.map((task) =>
                task.id === taskId
                    ? { ...task, status: newStatus }
                    : task
            )
        );
    };

    const handleDeleteTask = (taskId) => {
        const shouldDelete = window.confirm(
            'Are you sure you want to delete this task?'
        );

        if (!shouldDelete) return;

        setTasks((previous) =>
            previous.filter((task) => task.id !== taskId)
        );
    };

    return (
        <div className="page-content tasks-page">
            <section className="welcome-section tasks-page__heading">
                <div>
                    <div className="eyebrow">TASKFLOW WORKSPACE</div>
                    <h1>My Tasks</h1>
                    <p>Organize your work and keep track of your daily tasks.</p>
                </div>

                <Button onClick={openCreateForm}>
                    <Plus size={18} />
                    Create task
                </Button>
            </section>

            <section className="tasks-summary" aria-label="Task summary">
                <article className="tasks-summary__card">
                    <div className="tasks-summary__icon">
                        <ListTodo size={20} />
                    </div>
                    <div>
                        <p>Total tasks</p>
                        <h2>{tasks.length}</h2>
                    </div>
                </article>

                <article className="tasks-summary__card">
                    <div className="tasks-summary__icon tasks-summary__icon--blue">
                        <Clock3 size={20} />
                    </div>
                    <div>
                        <p>In progress</p>
                        <h2>{inProgressCount}</h2>
                    </div>
                </article>

                <article className="tasks-summary__card">
                    <div className="tasks-summary__icon tasks-summary__icon--green">
                        <CheckCircle2 size={20} />
                    </div>
                    <div>
                        <p>Completed</p>
                        <h2>{completedCount}</h2>
                    </div>
                </article>

                <article className="tasks-summary__card">
                    <div className="tasks-summary__icon tasks-summary__icon--orange">
                        <Circle size={20} />
                    </div>
                    <div>
                        <p>To do</p>
                        <h2>{todoCount}</h2>
                    </div>
                </article>
            </section>

            <section className="tasks-toolbar">
                <div className="tasks-toolbar__search">
                    <Search size={19} aria-hidden="true" />
                    <Input
                        type="search"
                        name="taskSearch"
                        placeholder="Search tasks or projects..."
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        aria-label="Search tasks or projects"
                    />
                </div>

                <div className="tasks-toolbar__filters">
                    <label htmlFor="task-priority-filter">Priority</label>
                    <select
                        id="task-priority-filter"
                        value={activePriority}
                        onChange={(event) => setActivePriority(event.target.value)}
                    >
                        <option value="All">All priorities</option>
                        {priorityOptions.map((priority) => (
                            <option key={priority} value={priority}>
                                {priority}
                            </option>
                        ))}
                    </select>
                </div>
            </section>

            <section className="tasks-list-section">
                <div className="tasks-list-section__header">
                    <div>
                        <h2>Your tasks</h2>
                        <p>
                            {filteredTasks.length}{' '}
                            {filteredTasks.length === 1 ? 'task' : 'tasks'} found
                        </p>
                    </div>

                    <div className="tasks-status-tabs" aria-label="Filter tasks by status">
                        {statusOptions.map((status) => (
                            <button
                                key={status}
                                type="button"
                                className={
                                    activeStatus === status
                                        ? 'tasks-status-tabs__button is-active'
                                        : 'tasks-status-tabs__button'
                                }
                                onClick={() => setActiveStatus(status)}
                                aria-pressed={activeStatus === status}
                            >
                                {status}
                            </button>
                        ))}
                    </div>
                </div>

                {filteredTasks.length > 0 ? (
                    <div className="tasks-list">
                        {filteredTasks.map((task) => (
                            <article className="task-card" key={task.id}>
                                <div className="task-card__main">
                                    <div className="task-card__title-row">
                                        <h3>{task.title}</h3>

                                        <span
                                            className={`task-badge task-badge--priority-${task.priority.toLowerCase()}`}
                                        >
                                            {task.priority}
                                        </span>
                                    </div>

                                    {task.description && (
                                        <p className="task-card__description">
                                            {task.description}
                                        </p>
                                    )}

                                    <div className="task-card__meta">
                                        <span>
                                            <ListTodo size={15} />
                                            {task.project}
                                        </span>

                                        <span>
                                            <CalendarDays size={15} />
                                            {formatDate(task.dueDate)}
                                        </span>
                                    </div>
                                </div>

                                <div className="task-card__actions">
                                    <label
                                        className="task-card__status-label"
                                        htmlFor={`task-status-${task.id}`}
                                    >
                                        Status
                                    </label>

                                    <select
                                        id={`task-status-${task.id}`}
                                        className={`task-status-select task-status-select--${task.status.toLowerCase().replaceAll(' ', '-')}`}
                                        value={task.status}
                                        onChange={(event) =>
                                            handleStatusChange(task.id, event.target.value)
                                        }
                                    >
                                        <option value="To Do">To Do</option>
                                        <option value="In Progress">In Progress</option>
                                        <option value="Completed">Completed</option>
                                    </select>

                                    <Button
                                        variant="ghost"
                                        size="small"
                                        onClick={() => handleDeleteTask(task.id)}
                                        aria-label={`Delete ${task.title}`}
                                    >
                                        <Trash2 size={16} />
                                        Delete
                                    </Button>
                                </div>
                            </article>
                        ))}
                    </div>
                ) : (
                    <div className="tasks-empty-state">
                        <div className="tasks-empty-state__icon">
                            <ListTodo size={28} />
                        </div>
                        <h3>No tasks found</h3>
                        <p>
                            Try changing your search or filters, or create a new task.
                        </p>
                        <Button onClick={openCreateForm}>
                            <Plus size={17} />
                            Create task
                        </Button>
                    </div>
                )}
            </section>

            <Modal
                open={showForm}
                onClose={closeCreateForm}
                title="Create task"
                description="Add a task and organize your work."
            >
                <form className="tasks-form"
                    onSubmit={handleCreateTask}
                    noValidate>
                    <Input
                        label="Task title"
                        id="task-title"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="e.g. Review homepage design"
                        required
                        maxLength={120}
                        error={formError}
                    />

                    <div className="common-field">
                        <label className="common-field__label" htmlFor="task-description">
                            Description
                        </label>
                        <textarea
                            id="task-description"
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="What needs to be done?"
                            maxLength={500}
                            rows={3}
                        />
                    </div>

                    <div className="common-field">
                        <label className="common-field__label" htmlFor="task-project">
                            Project
                        </label>
                        <select
                            id="task-project"
                            name="project"
                            value={formData.project}
                            onChange={handleInputChange}
                        >
                            <option value="Website Redesign">Website Redesign</option>
                            <option value="Mobile Application">Mobile Application</option>
                            <option value="Admin Dashboard">Admin Dashboard</option>
                        </select>
                    </div>

                    <div className="tasks-form__row">
                        <div className="common-field">
                            <label className="common-field__label" htmlFor="task-priority">
                                Priority
                            </label>
                            <select
                                id="task-priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleInputChange}
                            >
                                {priorityOptions.map((priority) => (
                                    <option key={priority} value={priority}>
                                        {priority}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="common-field">
                            <label className="common-field__label" htmlFor="task-due-date">
                                Due date
                            </label>
                            <input
                                id="task-due-date"
                                className="common-input"
                                type="date"
                                name="dueDate"
                                value={formData.dueDate}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>

                    <div className="common-field">
                        <label className="common-field__label" htmlFor="task-form-status">
                            Initial status
                        </label>
                        <select
                            id="task-form-status"
                            name="status"
                            value={formData.status}
                            onChange={handleInputChange}
                        >
                            <option value="To Do">To Do</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                        </select>
                    </div>

                    <div className="tasks-form__actions">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={closeCreateForm}
                        >
                            Cancel
                        </Button>

                        <Button type="submit">
                            Create task
                        </Button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}

export default MyTasksPage;
