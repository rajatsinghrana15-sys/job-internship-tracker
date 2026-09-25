import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard,
  BriefcaseBusiness,
  CalendarDays,
  BarChart3,
  Settings,
  LogOut,
  Plus,
  ArrowUpRight,
  Clock3,
  CheckCircle2,
  XCircle,
  CircleDot,
} from "lucide-react";

import "../style/Dashboard.css";

function Dashboard() {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    total: 0,
    applied: 0,
    interviews: 0,
    offers: 0,
    rejected: 0,
  });

  const [upcomingInterviews, setUpcomingInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }

    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token");

      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [statsResponse, applicationsResponse, interviewsResponse] =
        await Promise.all([
          axios.get(`${import.meta.env.VITE_API_URL}/api/applications/stats`, {
            headers,
          }),

          axios.get(`${import.meta.env.VITE_API_URL}/api/applications`, {
            headers,
          }),

          axios.get(`${import.meta.env.VITE_API_URL}/api/interviews/upcoming`, {
            headers,
          }),
        ]);

      setStats(statsResponse.data);

      setApplications(applicationsResponse.data.slice(0, 5));

      setUpcomingInterviews(interviewsResponse.data);
    } catch (error) {
      console.error("Failed to load dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const getStatusIcon = (status) => {
    if (status === "Applied") {
      return <CircleDot size={15} />;
    }

    if (status === "Interview") {
      return <Clock3 size={15} />;
    }

    if (status === "Offer") {
      return <CheckCircle2 size={15} />;
    }

    if (status === "Rejected") {
      return <XCircle size={15} />;
    }

    return <CircleDot size={15} />;
  };

  return (
    <div className="dashboard-page">
      <aside className="dashboard-sidebar">
        <div className="dashboard-logo">
          <BriefcaseBusiness size={22} />
          <span>JobTrack</span>
        </div>

        <nav className="dashboard-nav">
          <Link to="/dashboard" className="dashboard-nav-item active">
            <LayoutDashboard size={18} />
            Dashboard
          </Link>

          <Link to="/applications" className="dashboard-nav-item">
            <BriefcaseBusiness size={18} />
            Applications
          </Link>

          <Link to="/interviews" className="dashboard-nav-item">
            <CalendarDays size={18} />
            Interviews
          </Link>

          <Link to="/analytics" className="dashboard-nav-item">
            <BarChart3 size={18} />
            Analytics
          </Link>

          <Link to="/settings" className="dashboard-nav-item">
            <Settings size={18} />
            Settings
          </Link>
        </nav>

        <button className="dashboard-logout" onClick={handleLogout}>
          <LogOut size={18} />
          Logout
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="dashboard-topbar">
          <div>
            <h1>
              Welcome back
              {user?.name ? `, ${user.name}` : ""}
            </h1>

            <p>Here's an overview of your job search.</p>
          </div>

          <Link to="/applications/add" className="dashboard-add-btn">
            <Plus size={18} />
            Add Application
          </Link>
        </header>

        <section className="dashboard-stats">
          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <BriefcaseBusiness size={20} />
            </div>

            <div>
              <span>Total Applications</span>
              <strong>{loading ? "—" : stats.total}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <CircleDot size={20} />
            </div>

            <div>
              <span>Applied</span>
              <strong>{loading ? "—" : stats.applied}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <Clock3 size={20} />
            </div>

            <div>
              <span>Interviews</span>
              <strong>{loading ? "—" : stats.interviews}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <CheckCircle2 size={20} />
            </div>

            <div>
              <span>Offers</span>
              <strong>{loading ? "—" : stats.offers}</strong>
            </div>
          </div>

          <div className="dashboard-stat-card">
            <div className="dashboard-stat-icon">
              <XCircle size={20} />
            </div>

            <div>
              <span>Rejected</span>
              <strong>{loading ? "—" : stats.rejected}</strong>
            </div>
          </div>
        </section>

        <section className="dashboard-content-grid">
          <div className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Recent Applications</h2>
                <p>Your latest job applications.</p>
              </div>

              <Link to="/applications">
                View All
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="dashboard-empty">Loading applications...</div>
            ) : applications.length === 0 ? (
              <div className="dashboard-empty">
                <BriefcaseBusiness size={30} />

                <h3>No applications yet</h3>

                <p>
                  Start tracking your job applications by adding your first one.
                </p>

                <Link to="/applications/add" className="dashboard-empty-btn">
                  <Plus size={16} />
                  Add Application
                </Link>
              </div>
            ) : (
              <div className="dashboard-applications-list">
                {applications.map((application) => (
                  <div
                    className="dashboard-application-item"
                    key={application._id}
                  >
                    <div className="dashboard-company-logo">
                      {application.company.charAt(0).toUpperCase()}
                    </div>

                    <div className="dashboard-application-info">
                      <strong>{application.company}</strong>

                      <span>{application.role}</span>
                    </div>

                    <div className="dashboard-application-status">
                      <span
                        className={`dashboard-status ${application.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {getStatusIcon(application.status)}

                        {application.status}
                      </span>

                      <small>{formatDate(application.applicationDate)}</small>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="dashboard-panel">
            <div className="dashboard-panel-header">
              <div>
                <h2>Quick Actions</h2>
                <p>Manage your job search.</p>
              </div>
            </div>

            <div className="dashboard-quick-actions">
              <Link to="/applications/add" className="dashboard-quick-action">
                <Plus size={20} />

                <div>
                  <strong>Add Application</strong>

                  <span>Track a new job opportunity</span>
                </div>

                <ArrowUpRight size={16} />
              </Link>

              <Link to="/applications" className="dashboard-quick-action">
                <BriefcaseBusiness size={20} />

                <div>
                  <strong>View Applications</strong>

                  <span>Manage all your applications</span>
                </div>

                <ArrowUpRight size={16} />
              </Link>
            </div>
          </div>
          <section className="dashboard-upcoming-section">
            <div className="dashboard-panel-header">
              <div>
                <h2>Upcoming Interviews</h2>
                <p>Your next scheduled interviews.</p>
              </div>

              <Link to="/interviews">
                View All
                <ArrowUpRight size={16} />
              </Link>
            </div>

            {loading ? (
              <div className="dashboard-empty">Loading interviews...</div>
            ) : upcomingInterviews.length === 0 ? (
              <div className="dashboard-empty">
                <CalendarDays size={30} />

                <h3>No upcoming interviews</h3>

                <p>Schedule an interview to see it here.</p>

                <Link to="/interviews/add" className="dashboard-empty-btn">
                  <Plus size={16} />
                  Add Interview
                </Link>
              </div>
            ) : (
              <div className="dashboard-upcoming-list">
                {upcomingInterviews.map((interview) => (
                  <div className="dashboard-upcoming-item" key={interview._id}>
                    <div className="dashboard-interview-icon">
                      <CalendarDays size={19} />
                    </div>

                    <div className="dashboard-interview-info">
                      <strong>{interview.company}</strong>

                      <span>{interview.role}</span>

                      <small>
                        {new Date(interview.interviewDate).toLocaleDateString(
                          "en-IN",
                          {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          },
                        )}

                        {" • "}

                        {new Date(interview.interviewDate).toLocaleTimeString(
                          "en-IN",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          },
                        )}
                      </small>
                    </div>

                    <span className="dashboard-interview-type">
                      {interview.interviewType}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </section>
      </main>
    </div>
  );
}

export default Dashboard;
