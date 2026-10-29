
import { useState } from 'react';
import {
  Search,
  CircleHelp,
  FolderKanban,
  CheckSquare,
  Users,
  Settings,
  ChevronDown,
  MessageCircle,
} from 'lucide-react';

const helpTopics = [
  {
    question: 'How do I create a project?',
    answer:
      'Open the Projects page and look for the button to create a new project. Enter the project details and save them.',
    icon: FolderKanban,
  },
  {
    question: 'How do I manage my tasks?',
    answer:
      'Open My Tasks to review your tasks, check their status, and use the available task actions.',
    icon: CheckSquare,
  },
  {
    question: 'How do I manage my team?',
    answer:
      'Visit the Team page to view team members and use the team management features available in your workspace.',
    icon: Users,
  },
  {
    question: 'How do I update my profile or settings?',
    answer:
      'Open Settings to manage the preferences available in your account. Profile management can be added separately.',
    icon: Settings,
  },
  {
    question: 'Where can I view project reports?',
    answer:
      'Open Reports from the sidebar to view the reporting features available in TaskFlow.',
    icon: CircleHelp,
  },
];

const HelpSupportPage = () => {
  const [search, setSearch] = useState('');
  const [openIndex, setOpenIndex] = useState(0);

  const filteredTopics = helpTopics.filter((topic) =>
    `${topic.question} ${topic.answer}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="page-content help-page">
      <div className="welcome-section">
        <div>
          <div className="eyebrow">TASKFLOW WORKSPACE</div>
          <h1>Help & Support</h1>
          <p>
            Find answers and learn how to use TaskFlow.
          </p>
        </div>
      </div>

      <section className="help-hero">
        <div className="help-hero-icon">
          <MessageCircle size={30} />
        </div>

        <h2>How can we help you?</h2>
        <p>Search our frequently asked questions.</p>

        <div className="help-search">
          <Search size={20} />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setOpenIndex(-1);
            }}
            placeholder="Search for help..."
            aria-label="Search frequently asked questions"
          />
        </div>
      </section>

      <section className="help-faq-section">
        <h2>Frequently Asked Questions</h2>

        {filteredTopics.length > 0 ? (
          filteredTopics.map((topic, index) => {
            const Icon = topic.icon;
            const isOpen = openIndex === index;

            return (
              <div className="help-faq-item" key={topic.question}>
                <button
                  type="button"
                  className="help-faq-question"
                  onClick={() =>
                    setOpenIndex(isOpen ? -1 : index)
                  }
                  aria-expanded={isOpen}
                >
                  <span className="help-faq-title">
                    <Icon size={19} />
                    {topic.question}
                  </span>

                  <ChevronDown
                    size={19}
                    className={isOpen ? 'help-chevron-open' : ''}
                  />
                </button>

                {isOpen && (
                  <p className="help-faq-answer">
                    {topic.answer}
                  </p>
                )}
              </div>
            );
          })
        ) : (
          <div className="help-empty">
            <CircleHelp size={28} />
            <p>No matching questions found.</p>
            <span>Try a different search term.</span>
          </div>
        )}
      </section>

      <section className="help-contact-card">
        <MessageCircle size={25} />
        <div>
          <h3>Still need help?</h3>
          <p>
            Contact your workspace administrator for assistance.
          </p>
        </div>
      </section>
    </div>
  );
};

export default HelpSupportPage;
