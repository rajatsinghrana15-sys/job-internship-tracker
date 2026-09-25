import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, Save } from "lucide-react";
import axios from "axios";
import "../style/AddApplication.css";

function AddApplication() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    type: "Full Time",
    location: "",
    status: "Applied",
    applicationDate: "",
    jobUrl: "",
    notes: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${import.meta.env.VITE_API_URL}/api/applications`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "Failed to add application.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="application-page">
      {/* Header */}
      <header className="application-page-header">
        <Link to="/dashboard" className="back-link">
          <ArrowLeft size={18} />
          Back to Dashboard
        </Link>

        <div className="application-brand">
          <BriefcaseBusiness size={21} />
          <span>JobTrack</span>
        </div>
      </header>

      {/* Main */}
      <main className="application-form-container">
        <div className="application-form-heading">
          <div>
            <h1>Add Application</h1>

            <p>Add a new job or internship application to your tracker.</p>
          </div>
        </div>

        <div className="application-form-card">
          {error && <div className="application-form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Company + Role */}
            <div className="form-row">
              <div className="application-form-group">
                <label htmlFor="company">Company</label>

                <input
                  id="company"
                  type="text"
                  name="company"
                  placeholder="e.g. Google"
                  value={formData.company}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="application-form-group">
                <label htmlFor="role">Job Role</label>

                <input
                  id="role"
                  type="text"
                  name="role"
                  placeholder="e.g. Frontend Developer"
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Type + Location */}
            <div className="form-row">
              <div className="application-form-group">
                <label htmlFor="type">Job Type</label>

                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                >
                  <option value="Full Time">Full Time</option>

                  <option value="Internship">Internship</option>

                  <option value="Part Time">Part Time</option>

                  <option value="Contract">Contract</option>
                </select>
              </div>

              <div className="application-form-group">
                <label htmlFor="location">Location</label>

                <input
                  id="location"
                  type="text"
                  name="location"
                  placeholder="e.g. Bangalore / Remote"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Status + Date */}
            <div className="form-row">
              <div className="application-form-group">
                <label htmlFor="status">Application Status</label>

                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                >
                  <option value="Applied">Applied</option>

                  <option value="Interview">Interview</option>

                  <option value="Offer">Offer</option>

                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div className="application-form-group">
                <label htmlFor="applicationDate">Application Date</label>

                <input
                  id="applicationDate"
                  type="date"
                  name="applicationDate"
                  value={formData.applicationDate}
                  onChange={handleChange}
                />
              </div>
            </div>

            {/* Job URL */}
            <div className="application-form-group">
              <label htmlFor="jobUrl">Job URL</label>

              <input
                id="jobUrl"
                type="url"
                name="jobUrl"
                placeholder="https://example.com/job"
                value={formData.jobUrl}
                onChange={handleChange}
              />
            </div>

            {/* Notes */}
            <div className="application-form-group">
              <label htmlFor="notes">Notes</label>

              <textarea
                id="notes"
                name="notes"
                rows="5"
                placeholder="Add any important notes about this application..."
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            {/* Buttons */}
            <div className="application-form-actions">
              <Link to="/dashboard" className="cancel-application-btn">
                Cancel
              </Link>

              <button
                type="submit"
                className="save-application-btn"
                disabled={loading}
              >
                <Save size={17} />

                {loading ? "Saving..." : "Save Application"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default AddApplication;
