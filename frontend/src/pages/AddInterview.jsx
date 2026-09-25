import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, CalendarDays, Save } from "lucide-react";
import axios from "axios";

import "../style/AddInterview.css";

function AddInterview() {
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

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

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
      setLoading(true);

      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/interviews`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate("/interviews");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add interview.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="add-interview-page">
      <header className="add-interview-header">
        <Link to="/interviews" className="add-interview-back">
          <ArrowLeft size={18} />
          Back to Interviews
        </Link>

        <div className="add-interview-brand">
          <CalendarDays size={21} />
          <span>JobTrack</span>
        </div>
      </header>

      <main className="add-interview-main">
        <div className="add-interview-title">
          <h1>Add Interview</h1>
          <p>Add an interview and keep your schedule organized.</p>
        </div>

        <form className="add-interview-form" onSubmit={handleSubmit}>
          {error && <div className="add-interview-error">{error}</div>}

          <div className="add-interview-grid">
            <div className="form-group">
              <label htmlFor="company">Company</label>

              <input
                id="company"
                name="company"
                type="text"
                placeholder="e.g. Infosys"
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
                placeholder="e.g. Frontend Developer"
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
                placeholder="https://meet.google.com/..."
                value={formData.meetingLink}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group form-group-full">
            <label htmlFor="notes">Notes</label>

            <textarea
              id="notes"
              name="notes"
              rows="5"
              placeholder="Add interview preparation notes..."
              value={formData.notes}
              onChange={handleChange}
            />
          </div>

          <div className="add-interview-actions">
            <Link to="/interviews" className="cancel-interview-btn">
              Cancel
            </Link>

            <button
              type="submit"
              className="save-interview-btn"
              disabled={loading}
            >
              <Save size={17} />

              {loading ? "Saving..." : "Save Interview"}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}

export default AddInterview;
