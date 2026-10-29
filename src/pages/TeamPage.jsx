
import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  ShieldCheck,
  UserRound,
  MoreHorizontal,
  Mail,
  Trash2,
  X,
  UsersRound,
} from 'lucide-react';

import Button from '../components/common/Button';
import Input from '../components/common/Input';
import Modal from '../components/common/Modal';

// Demo data. Replace with API data when the backend is ready.
const initialMembers = [
  {
    id: 1,
    name: 'Mayur',
    email: 'mayur@example.com',
    role: 'Admin',
    status: 'Active',
  },
  {
    id: 2,
    name: 'Aarav Patel',
    email: 'aarav@example.com',
    role: 'Manager',
    status: 'Active',
  },
  {
    id: 3,
    name: 'Diya Shah',
    email: 'diya@example.com',
    role: 'Member',
    status: 'Active',
  },
  {
    id: 4,
    name: 'Rohan Mehta',
    email: 'rohan@example.com',
    role: 'Member',
    status: 'Pending',
  },
];

// Demo logged-in user ID.
// Replace this with the authenticated user's ID when login is implemented.
const CURRENT_USER_ID = 1;

const emptyForm = {
  name: '',
  email: '',
  role: 'Member',
};

const TeamPage = () => {
  const [members, setMembers] = useState(initialMembers);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [formError, setFormError] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [feedback, setFeedback] = useState('');

  const menuAreaRef = useRef(null);

  // Search and role filtering.
  const filteredMembers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return members.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(query) ||
        member.email.toLowerCase().includes(query);

      const matchesRole =
        roleFilter === 'All' || member.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [members, search, roleFilter]);

  // Summary cards always use the full members list, not filtered results.
  const totalMembers = members.length;

  const activeCount = members.filter(
    (member) => member.status === 'Active'
  ).length;

  const adminCount = members.filter(
    (member) => member.role === 'Admin'
  ).length;

  // Close the three-dot menu on outside click or Escape.
  useEffect(() => {
    if (openMenuId === null) return undefined;

    const handleOutsideClick = (event) => {
      if (
        menuAreaRef.current &&
        !menuAreaRef.current.contains(event.target)
      ) {
        setOpenMenuId(null);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setOpenMenuId(null);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [openMenuId]);

  const closeModal = () => {
    setShowModal(false);
    setFormData(emptyForm);
    setFormError('');
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: value,
    }));

    setFormError('');
  };

  const handleAddMember = (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const email = formData.email.trim().toLowerCase();

    if (!name || !email) {
      setFormError('Please enter the member name and email.');
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(email)) {
      setFormError('Please enter a valid email address.');
      return;
    }

    const emailExists = members.some(
      (member) => member.email.trim().toLowerCase() === email
    );

    if (emailExists) {
      setFormError('A member with this email already exists.');
      return;
    }

    const newMember = {
      id: Date.now(),
      name,
      email,
      role: formData.role,
      // A new member is pending until an invitation is accepted.
      status: 'Pending',
    };

    setMembers((currentMembers) => [...currentMembers, newMember]);

    closeModal();
    setOpenMenuId(null);
    setFeedback(
      'Member added with Pending status. This demo does not send an email invitation.'
    );
  };

  const handleRemoveMember = (member) => {
    // Protect the currently logged-in user.
    if (member.id === CURRENT_USER_ID) {
      setOpenMenuId(null);
      setFeedback('You cannot remove your own account.');
      return;
    }

    // Protect the last remaining admin.
    if (member.role === 'Admin' && adminCount <= 1) {
      setOpenMenuId(null);
      setFeedback('The last admin cannot be removed.');
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to remove ${member.name} (${member.email})?`
    );

    if (!confirmed) return;

    setMembers((currentMembers) =>
      currentMembers.filter((item) => item.id !== member.id)
    );

    setOpenMenuId(null);
    setFeedback(`${member.name} was removed from the demo team.`);
  };

  const canRemoveMember = (member) => {
    if (member.id === CURRENT_USER_ID) return false;

    if (member.role === 'Admin' && adminCount <= 1) {
      return false;
    }

    return true;
  };

  const getInitials = (name) =>
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0])
      .join('')
      .toUpperCase();

  return (
    <div className="page-content team-page">
      <section className="welcome-section team-page__heading">
        <div>
          <div className="eyebrow">TASKFLOW WORKSPACE</div>
          <h1>Team</h1>
          <p>Manage your workspace members and their roles.</p>
        </div>

        <Button onClick={() => setShowModal(true)}>
          <UserPlus size={17} aria-hidden="true" />
          Add member
        </Button>
      </section>

      {feedback && (
        <div className="team-feedback" role="status">
          <span>{feedback}</span>
          <button
            type="button"
            onClick={() => setFeedback('')}
            aria-label="Dismiss message"
          >
            <X size={16} aria-hidden="true" />
          </button>
        </div>
      )}

      <section className="team-summary" aria-label="Team overview">
        <article className="team-summary__card">
          <div className="team-summary__icon team-summary__icon--purple">
            <Users size={21} aria-hidden="true" />
          </div>
          <div>
            <p>Total members</p>
            <h2>{totalMembers}</h2>
          </div>
        </article>

        <article className="team-summary__card">
          <div className="team-summary__icon team-summary__icon--green">
            <UserRound size={21} aria-hidden="true" />
          </div>
          <div>
            <p>Active members</p>
            <h2>{activeCount}</h2>
          </div>
        </article>

        <article className="team-summary__card">
          <div className="team-summary__icon team-summary__icon--blue">
            <ShieldCheck size={21} aria-hidden="true" />
          </div>
          <div>
            <p>Admins</p>
            <h2>{adminCount}</h2>
          </div>
        </article>
      </section>

      <section
        className="team-toolbar"
        aria-label="Filter team members"
      >
        <div className="team-toolbar__search">
          <Search size={19} aria-hidden="true" />
          <Input
            type="search"
            name="teamSearch"
            placeholder="Search by name or email..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            aria-label="Search team members"
          />
        </div>

        <div className="team-toolbar__role">
          <label htmlFor="team-role-filter">Role</label>
          <select
            id="team-role-filter"
            value={roleFilter}
            onChange={(event) => setRoleFilter(event.target.value)}
          >
            <option value="All">All roles</option>
            <option value="Admin">Admin</option>
            <option value="Manager">Manager</option>
            <option value="Member">Member</option>
          </select>
        </div>
      </section>

      <section className="team-list-section">
        <div className="team-list-section__heading">
          <div>
            <h2>Team members</h2>
            <p>
              {filteredMembers.length}{' '}
              {filteredMembers.length === 1 ? 'member' : 'members'} found
            </p>
          </div>
        </div>

        {filteredMembers.length > 0 ? (
          <div className="team-table-wrap">
            <table className="team-table">
              <thead>
                <tr>
                  <th scope="col">Member</th>
                  <th scope="col">Role</th>
                  <th scope="col">Status</th>
                  <th scope="col">
                    <span className="team-sr-only">Actions</span>
                  </th>
                </tr>
              </thead>

              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.id}>
                    <td>
                      <div className="team-member">
                        <div
                          className="team-member__avatar"
                          aria-hidden="true"
                        >
                          {getInitials(member.name)}
                        </div>

                        <div className="team-member__details">
                          <strong>{member.name}</strong>
                          <span>
                            <Mail size={14} aria-hidden="true" />
                            {member.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`team-role team-role--${member.role.toLowerCase()}`}
                      >
                        {member.role === 'Admin' && (
                          <ShieldCheck size={14} aria-hidden="true" />
                        )}
                        {member.role}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`team-status team-status--${member.status.toLowerCase()}`}
                      >
                        <span className="team-status__dot" />
                        {member.status}
                      </span>
                    </td>

                    <td className="team-table__actions">
                      <div
                        className="team-member-menu"
                        ref={
                          openMenuId === member.id
                            ? menuAreaRef
                            : null
                        }
                      >
                        <button
                          type="button"
                          className="team-member-menu__trigger"
                          aria-label={`Actions for ${member.name}`}
                          aria-haspopup="true"
                          aria-expanded={openMenuId === member.id}
                          onClick={() =>
                            setOpenMenuId((current) =>
                              current === member.id ? null : member.id
                            )
                          }
                        >
                          <MoreHorizontal size={20} aria-hidden="true" />
                        </button>

                        {openMenuId === member.id && (
                          <div className="team-member-menu__popup">
                            <button
                              type="button"
                              className="team-member-menu__remove"
                              disabled={!canRemoveMember(member)}
                              title={
                                member.id === CURRENT_USER_ID
                                  ? 'You cannot remove your own account'
                                  : member.role === 'Admin' && adminCount <= 1
                                    ? 'The last admin cannot be removed'
                                    : undefined
                              }
                              onClick={() => handleRemoveMember(member)}
                            >
                              <Trash2 size={15} aria-hidden="true" />
                              Remove member
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="team-empty">
            <UsersRound size={34} aria-hidden="true" />
            <h3>No members found</h3>
            <p>Try a different name, email, or role filter.</p>
            <Button
              variant="secondary"
              onClick={() => {
                setSearch('');
                setRoleFilter('All');
              }}
            >
              Clear filters
            </Button>
          </div>
        )}
      </section>

      <Modal
        open={showModal}
        onClose={closeModal}
        title="Add team member"
        description="Add a member to your local demo workspace."
        size="medium"
      >
        <form
          className="team-form"
          onSubmit={handleAddMember}
          noValidate
        >
          <Input
            label="Full name"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            placeholder="e.g. Priya Shah"
            autoComplete="name"
            required
          />

          <Input
            label="Email address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleInputChange}
            placeholder="e.g. priya@example.com"
            autoComplete="email"
            required
          />

          <div className="team-form__field">
            <label htmlFor="team-member-role">Role</label>
            <select
              id="team-member-role"
              name="role"
              value={formData.role}
              onChange={handleInputChange}
            >
              <option value="Member">Member</option>
              <option value="Manager">Manager</option>
              <option value="Admin">Admin</option>
            </select>
          </div>

          {formError && (
            <p className="team-form__error" role="alert">
              {formError}
            </p>
          )}

          <div className="team-form__actions">
            <Button
              type="button"
              variant="secondary"
              onClick={closeModal}
            >
              Cancel
            </Button>
            <Button type="submit">Add member</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default TeamPage;
