import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Plus,
  CalendarDays,
  Video,
  MapPin,
  ExternalLink,
  Pencil,
  Trash2,
} from "lucide-react";
import axios from "axios";

import "../style/Interviews.css";

function Interviews() {
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInterviews();
  }, []);

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/interviews", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInterviews(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load interviews.");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this interview?",
    );

    if (!confirmed) return;

    try {
      const token = localStorage.getItem("token");

      await axios.delete(`http://localhost:5000/api/interviews/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setInterviews((prev) => prev.filter((interview) => interview._id !== id));
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete interview.");
    }
  };

  const formatDate = (date) => {
    if (!date) return "No date";

    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  const formatTime = (date) => {
    if (!date) return "No time";

    return new Date(date).toLocaleTimeString("en-IN", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="interviews-page">
      <header className="interviews-header">
        <Link to="/dashboard" className="interviews-back-link">
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <div className="interviews-brand">
          <CalendarDays size={21} />
          <span>JobTrack</span>
        </div>

        <Link to="/interviews/add" className="interviews-add-btn">
          <Plus size={18} />
          Add Interview
        </Link>
      </header>

      <main className="interviews-main">
        <div className="interviews-title">
          <div>
            <h1>Interviews</h1>
            <p>Manage and track your upcoming and completed interviews.</p>
          </div>
        </div>

        {error && <div className="interviews-error">{error}</div>}

        {loading ? (
          <div className="interviews-empty">Loading interviews...</div>
        ) : interviews.length === 0 ? (
          <div className="interviews-empty">
            <CalendarDays size={38} />

            <h3>No interviews found</h3>

            <p>Add your first interview to keep your schedule organized.</p>

            <Link to="/interviews/add" className="interviews-empty-btn">
              <Plus size={17} />
              Add Interview
            </Link>
          </div>
        ) : (
          <div className="interviews-table-wrapper">
            <table className="interviews-table">
              <thead>
                <tr>
                  <th>Company</th>
                  <th>Role</th>
                  <th>Date</th>
                  <th>Time</th>
                  <th>Type</th>
                  <th>Status</th>
                  <th>Meeting</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {interviews.map((interview) => (
                  <tr key={interview._id}>
                    <td>
                      <div className="interview-company">
                        <div className="interview-company-logo">
                          {interview.company.charAt(0).toUpperCase()}
                        </div>

                        <strong>{interview.company}</strong>
                      </div>
                    </td>

                    <td>
                      <span className="interview-role">{interview.role}</span>
                    </td>

                    <td>
                      <span className="interview-date">
                        <CalendarDays size={14} />
                        {formatDate(interview.interviewDate)}
                      </span>
                    </td>

                    <td>
                      <span className="interview-time">
                        {formatTime(interview.interviewDate)}
                      </span>
                    </td>

                    <td>
                      <span className="interview-type">
                        {interview.interviewType}
                      </span>
                    </td>

                    <td>
                      <span
                        className={`interview-status ${interview.status
                          .toLowerCase()
                          .replace("-", "")}`}
                      >
                        {interview.status}
                      </span>
                    </td>

                    <td>
                      {interview.meetingLink ? (
                        <a
                          href={interview.meetingLink}
                          target="_blank"
                          rel="noreferrer"
                          className="interview-meeting-link"
                        >
                          <ExternalLink size={15} />
                          Join
                        </a>
                      ) : (
                        <span className="no-meeting-link">—</span>
                      )}
                    </td>

                    <td>
                      <div className="interview-actions">
                        <Link
                          to={`/interviews/edit/${interview._id}`}
                          className="edit-interview-btn"
                          title="Edit interview"
                        >
                          <Pencil size={15} />
                        </Link>

                        <button
                          className="delete-interview-btn"
                          onClick={() => handleDelete(interview._id)}
                          title="Delete interview"
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

export default Interviews;
