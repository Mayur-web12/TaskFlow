
import {
  BarChart,
  Bar,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import {
  ListTodo,
  CheckCircle2,
  Clock3,
  FolderKanban,
  ChartNoAxesCombined,
  Target,
} from 'lucide-react';

// DEMO DATA: replace with your application's shared data later.
const taskStatusData = [
  { name: 'To Do', value: 8, color: '#F59E0B' },
  { name: 'In Progress', value: 6, color: '#4F7DF3' },
  { name: 'Completed', value: 14, color: '#10A779' },
];

const weeklyTaskData = [
  { day: 'Mon', created: 5, completed: 3 },
  { day: 'Tue', created: 7, completed: 5 },
  { day: 'Wed', created: 4, completed: 6 },
  { day: 'Thu', created: 8, completed: 5 },
  { day: 'Fri', created: 6, completed: 7 },
  { day: 'Sat', created: 3, completed: 4 },
  { day: 'Sun', created: 2, completed: 3 },
];

const projectProgressData = [
  { name: 'Website Redesign', progress: 80 },
  { name: 'Mobile App', progress: 60 },
  { name: 'Dashboard UI', progress: 40 },
];

const totalTasks = taskStatusData.reduce(
  (total, item) => total + item.value,
  0
);

const completedTasks =
  taskStatusData.find((item) => item.name === 'Completed')?.value ?? 0;

const inProgressTasks =
  taskStatusData.find((item) => item.name === 'In Progress')?.value ?? 0;

const completionRate = totalTasks > 0? Math.round((completedTasks / totalTasks) * 100): 0;

const summaryCards = [
  {
    title: 'Total Tasks',
    value: totalTasks,
    description: 'Tasks across all statuses',
    icon: ListTodo,
    color: 'purple',
  },
  {
    title: 'Completed Tasks',
    value: completedTasks,
    description: 'Tasks marked completed',
    icon: CheckCircle2,
    color: 'green',
  },
  {
    title: 'In Progress',
    value: inProgressTasks,
    description: 'Tasks being worked on',
    icon: Clock3,
    color: 'blue',
  },
  {
    title: 'Total Projects',
    value: projectProgressData.length,
    description: 'Projects in this demo',
    icon: FolderKanban,
    color: 'orange',
  },
];

const ReportsPage = () => {
  return (
    <main className="page-content reports-page">
      {/* Page heading */}
      <header className="reports-heading">
        <div>
          <span className="reports-eyebrow">TASKFLOW WORKSPACE</span>
          <h1>Reports</h1>
          <p>
            Track your team's productivity, task status, and project progress.
          </p>
        </div>

        <span className="reports-demo-badge">Demo data</span>
      </header>

      {/* Summary cards */}
      <section
        className="reports-stats"
        aria-label="Workspace summary"
      >
        {summaryCards.map((item) => {
          const Icon = item.icon;

          return (
            <article className="report-stat-card" key={item.title}>
              <div
                className={`report-stat-icon report-stat-icon--${item.color}`}
              >
                <Icon size={22} aria-hidden="true" />
              </div>

              <div className="report-stat-content">
                <p>{item.title}</p>
                <h2>{item.value}</h2>
                <span>{item.description}</span>
              </div>
            </article>
          );
        })}
      </section>

      {/* Charts */}
      <section className="reports-charts">
        <article className="report-panel">
          <div className="report-panel-heading">
            <div>
              <h2>Task status overview</h2>
              <p>Distribution of tasks by current status.</p>
            </div>
            <ChartNoAxesCombined
              size={21}
              aria-hidden="true"
            />
          </div>

          <div className="report-donut-layout">
            <div className="report-donut-chart">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={taskStatusData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius="58%"
                    outerRadius="82%"
                    paddingAngle={4}
                    stroke="none"
                  >
                    {taskStatusData.map((item) => (
                      <Cell
                        key={item.name}
                        fill={item.color}
                      />
                    ))}
                  </Pie>

                  <Tooltip
                    formatter={(value, name) => [
                      `${value} tasks`,
                      name,
                    ]}
                  />
                </PieChart>
              </ResponsiveContainer>

              <div className="report-donut-center">
                <strong>{totalTasks}</strong>
                <span>Total tasks</span>
              </div>
            </div>

            <div className="report-chart-legend">
              {taskStatusData.map((item) => {
                const percentage =
                  totalTasks > 0
                    ? Math.round((item.value / totalTasks) * 100)
                    : 0;

                return (
                  <div
                    className="report-legend-item"
                    key={item.name}
                  >
                    <span className="report-legend-name">
                      <i
                        className="report-legend-dot"
                        style={{ backgroundColor: item.color }}
                      />
                      {item.name}
                    </span>

                    <strong>
                      {item.value}
                      <small>{percentage}%</small>
                    </strong>
                  </div>
                );
              })}
            </div>
          </div>
        </article>

        <article className="report-panel">
          <div className="report-panel-heading">
            <div>
              <h2>Weekly task activity</h2>
              <p>Tasks created versus completed each day.</p>
            </div>
            <ChartNoAxesCombined
              size={21}
              aria-hidden="true"
            />
          </div>

          <div
            className="report-bar-chart"
            role="img"
            aria-label="Bar chart comparing tasks created and completed over seven days"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={weeklyTaskData}
                margin={{ top: 8, right: 4, left: -22, bottom: 0 }}
                barGap={5}
              >
                <CartesianGrid
                  stroke="#EAECF2"
                  strokeDasharray="4 4"
                  vertical={false}
                />

                <XAxis
                  dataKey="day"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#667085', fontSize: 12 }}
                  tickMargin={10}
                />

                <YAxis
                  allowDecimals={false}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fill: '#667085', fontSize: 11 }}
                  width={38}
                />

                <Tooltip
                  cursor={{ fill: '#F5F4FF' }}
                  contentStyle={{
                    borderRadius: 10,
                    border: '1px solid #EAECF2',
                    fontSize: 12,
                  }}
                />

                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  wrapperStyle={{ fontSize: 12 }}
                />

                <Bar
                  dataKey="created"
                  name="Created"
                  fill="#7968EE"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={24}
                />

                <Bar
                  dataKey="completed"
                  name="Completed"
                  fill="#10A779"
                  radius={[5, 5, 0, 0]}
                  maxBarSize={24}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      {/* Project progress */}
      <section className="report-panel report-project-panel">
        <div className="report-panel-heading">
          <div>
            <h2>Project progress</h2>
            <p>Completion progress for each demo project.</p>
          </div>
          <Target size={21} aria-hidden="true" />
        </div>

        <div className="report-project-list">
          {projectProgressData.map((project) => (
            <div className="report-project-item" key={project.name}>
              <div className="report-project-info">
                <strong>{project.name}</strong>
                <span>{project.progress}%</span>
              </div>

              <div
                className="report-progress-track"
                role="progressbar"
                aria-label={`${project.name} completion`}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-valuenow={project.progress}
              >
                <div
                  className="report-progress-fill"
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </section>

      <p className="reports-demo-note">
        These are sample figures for UI development. Connect the page to
        your shared task and project data before using these reports for
        actual workspace decisions.
      </p>
    </main>
  );
};

export default ReportsPage;
