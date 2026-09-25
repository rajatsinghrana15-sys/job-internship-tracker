import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, BriefcaseBusiness, Save } from "lucide-react";
import axios from "axios";
import "../style/EditApplication.css";

function EditApplication() {
  const { id } = useParams();
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

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchApplication();
  }, [id]);

  const fetchApplication = async () => {
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

      const application = response.data.find((item) => item._id === id);

      if (!application) {
        setError("Application not found.");
        return;
      }

      setFormData({
        company: application.company || "",
        role: application.role || "",
        type: application.type || "Full Time",
        location: application.location || "",
        status: application.status || "Applied",
        applicationDate: application.applicationDate
          ? application.applicationDate.split("T")[0]
          : "",
        jobUrl: application.jobUrl || "",
        notes: application.notes || "",
      });
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load application.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setSaving(true);

    try {
      const token = localStorage.getItem("token");

      await axios.put(
        `${import.meta.env.VITE_API_URL}/api/applications/${id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      navigate("/applications");
    } catch (error) {
      setError(
        error.response?.data?.message || "Failed to update application.",
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="applications-empty">Loading application...</div>;
  }

  return (
    <div className="application-page">
      <header className="application-page-header">
        <Link to="/applications" className="back-link">
          <ArrowLeft size={18} />
          Back to Applications
        </Link>

        <div className="application-brand">
          <BriefcaseBusiness size={21} />
          <span>JobTrack</span>
        </div>
      </header>

      <main className="application-form-container">
        <div className="application-form-heading">
          <div>
            <h1>Edit Application</h1>

            <p>Update the details of your job application.</p>
          </div>
        </div>

        <div className="application-form-card">
          {error && <div className="application-form-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="application-form-group">
                <label htmlFor="company">Company</label>

                <input
                  id="company"
                  type="text"
                  name="company"
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
                  value={formData.role}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

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
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="application-form-group">
                <label htmlFor="status">Status</label>

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

            <div className="application-form-group">
              <label htmlFor="jobUrl">Job URL</label>

              <input
                id="jobUrl"
                type="url"
                name="jobUrl"
                value={formData.jobUrl}
                onChange={handleChange}
              />
            </div>

            <div className="application-form-group">
              <label htmlFor="notes">Notes</label>

              <textarea
                id="notes"
                name="notes"
                rows="5"
                value={formData.notes}
                onChange={handleChange}
              />
            </div>

            <div className="application-form-actions">
              <Link to="/applications" className="cancel-application-btn">
                Cancel
              </Link>

              <button
                type="submit"
                className="save-application-btn"
                disabled={saving}
              >
                <Save size={17} />

                {saving ? "Updating..." : "Update Application"}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}

export default EditApplication;
