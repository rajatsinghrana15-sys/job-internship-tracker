import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  Search,
  BriefcaseBusiness,
  MapPin,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";
import axios from "axios";
import "../style/Applications.css";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setApplications(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load applications.");
    } finally {
      setLoading(false);
    }
  };

  const filteredApplications = applications.filter((application) => {
    const searchText = search.toLowerCase();

    const matchesSearch =
      application.company.toLowerCase().includes(searchText) ||
      application.role.toLowerCase().includes(searchText);

    const matchesStatus =
      statusFilter === "All" || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this application?",
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(
        `${import.meta.env.VITE_API_URL}/api/applications/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setApplications((prev) =>
        prev.filter((application) => application._id !== id),
      );
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete application.");
    }
  };

  return (
    <div className="applications-page">
      <header className="applications-header">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <div className="applications-brand">
          <BriefcaseBusiness size={21} />
          <span>JobTrack</span>
        </div>

        <Link to="/applications/add" className="applications-add-btn">
          <Plus size={18} />
          Add Application
        </Link>
      </header>

      <main className="applications-main">
        <div className="applications-title">
          <div>
            <h1>Applications</h1>
            <p>Manage and track all your job applications.</p>
          </div>
        </div>

        <div className="applications-toolbar">
          <div className="applications-search">
            <Search size={18} />

            <input
              type="text"
              placeholder="Search company or role..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="applications-filter"
          >
            <option value="All">All Status</option>
            <option value="Applied">Applied</option>
            <option value="Interview">Interview</option>
            <option value="Offer">Offer</option>
            <option value="Rejected">Rejected</option>
          </select>
        </div>

        {error && <div className="applications-error">{error}</div>}

        {loading ? (
          <div className="applications-empty">Loading applications...</div>
        ) : filteredApplications.length === 0 ? (
          <div className="applications-empty">
            <BriefcaseBusiness size={35} />

            <h3>No applications found</h3>

            <p>
              Add your first job application to start tracking your job search.
            </p>

            <Link to="/applications/add" className="applications-empty-btn">
              <Plus size={17} />
              Add Application
            </Link>
          </div>
        ) : (
          <div className="applications-table-wrapper">
            <table className="applications-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Type</th>
                  <th>Location</th>
                  <th>Status</th>
                  <th>Date</th>
                  <th>Job</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredApplications.map((application) => (
                  <tr key={application._id}>
                    <td>
                      <div className="table-company">
                        <div className="table-company-logo">
                          {application.company.charAt(0).toUpperCase()}
                        </div>

                        <strong>{application.company}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="table-role">{application.role}</span>
                    </td>

                    <td>
                      <span className="table-type">{application.type}</span>
                    </td>

                    <td>
                      <span className="table-location">
                        <MapPin size={14} />
                        {application.location || "Not specified"}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`table-status ${application.status
                          .toLowerCase()
                          .replace(" ", "-")}`}
                      >
                        {application.status}
                      </span>
                    </td>

                    <td>
                      <span className="table-date">
                        {formatDate(application.applicationDate)}
                      </span>
                    </td>

                    <td>
                      {application.jobUrl ? (
                        <a
                          href={application.jobUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="job-link"
                        >
                          <ExternalLink size={15} />
                          View
                        </a>
                      ) : (
                        <span className="no-job-link">—</span>
                      )}
                    </td>

                    <td>
                      <div className="application-actions">
                        <Link
                          to={`/applications/edit/${application._id}`}
                          className="edit-application-btn"
                          title="Edit application"
                        >
                          <Pencil size={15} />
                        </Link>

                        <button
                          className="delete-application-btn"
                          onClick={() => handleDelete(application._id)}
                          title="Delete application"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}

export default Applications;
