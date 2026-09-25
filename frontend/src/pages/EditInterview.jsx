import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CalendarDays, Save } from "lucide-react";
import axios from "axios";

import "../style/EditInterview.css";

function EditInterview() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    interviewDate: "",
    interviewType: "Online",
    meetingLink: "",
    notes: "",
    status: "Upcoming",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchInterview();
  }, [id]);

  const fetchInterview = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/interviews`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const interview = response.data.find((item) => item._id === id);

      if (!interview) {
        setError("Interview not found.");
        return;
      }

      setFormData({
        company: interview.company || "",
        role: interview.role || "",
        interviewDate: interview.interviewDate
          ? new Date(interview.interviewDate).toISOString().slice(0, 16)
          : "",
        interviewType: interview.interviewType || "Online",
        meetingLink: interview.meetingLink || "",
        notes: interview.notes || "",
        status: interview.status || "Upcoming",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load interview.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    if (!formData.company || !formData.role || !formData.interviewDate) {
      setError("Company, role and interview date are required.");
      return;
    }

    try {
      setSaving(true);

      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/interviews/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate("/interviews");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to update interview.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="edit-interview-loading">Loading interview...</div>;
  }

  return (
    <div className="edit-interview-page">
      <header className="edit-interview-header">
        <Link to="/interviews" className="edit-interview-back">
          <ArrowLeft size={18} />
          Back to Interviews
        </Link>

        <div className="edit-interview-brand">
          <CalendarDays size={21} />
          <span>JobTrack</span>
        </div>
      </header>

      <main className="edit-interview-main">
        <div className="edit-interview-title">
          <h1>Edit Interview</h1>
          <p>Update your interview details and schedule.</p>
        </div>

        <form className="edit-interview-form" onSubmit={handleSubmit}>
          {error && <div className="edit-interview-error">{error}</div>}

          <div className="edit-interview-grid">
            <div className="form-group">
              <label htmlFor="company">Company</label>

              <input
                id="company"
                name="company"
                type="text"
                value={formData.company}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">Role</label>

              <input
                id="role"
                name="role"
                type="text"
                value={formData.role}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="interviewDate">Interview Date & Time</label>

              <input
                id="interviewDate"
                name="interviewDate"
                type="datetime-local"
                value={formData.interviewDate}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="interviewType">Interview Type</label>

              <select
                id="interviewType"
                name="interviewType"
                value={formData.interviewType}
                onChange={handleChange}
              >
                <option value="Online">Online</option>
                <option value="Phone">Phone</option>
                <option value="Video">Video</option>
                <option value="In-Person">In-Person</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="status">Status</label>

              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
              >
                <option value="Upcoming">Upcoming</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="meetingLink">Meeting Link</label>

              <input
                id="meetingLink"
                name="meetingLink"
                type="url"
                value={formData.meetingLink}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group edit-interview-notes">
            <label htmlFor="notes">Notes</label>

            <textarea
              id="notes"
              name="notes"
              rows="5"
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="edit-interview-actions">
            <Link to="/interviews" className="cancel-edit-interview-btn">
              Cancel
            </Link>

            <button
              type="submit"
              className="save-edit-interview-btn"
              disabled={saving}
            >
              <Save size={17} />

              {saving ? "Saving..." : "Update Interview"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default EditInterview;
