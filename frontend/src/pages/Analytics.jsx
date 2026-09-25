import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  BarChart3,
  BriefcaseBusiness,
  CheckCircle2,
  Clock3,
  XCircle,
  CircleDot,
} from "lucide-react";
import axios from "axios";

import "../style/Analytics.css";

function Analytics() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get(
        "http://localhost:5000/api/applications/analytics",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAnalytics(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Failed to load analytics.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-loading">Loading analytics...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-error">{error}</div>
      </div>
    );
  }

  const statusData = [
    {
      label: "Applied",
      value: analytics?.statusBreakdown?.applied || 0,
      icon: <CircleDot size={20} />,
      className: "applied",
    },
    {
      label: "Interviews",
      value: analytics?.statusBreakdown?.interviews || 0,
      icon: <Clock3 size={20} />,
      className: "interviews",
    },
    {
      label: "Offers",
      value: analytics?.statusBreakdown?.offers || 0,
      icon: <CheckCircle2 size={20} />,
      className: "offers",
    },
    {
      label: "Rejected",
      value: analytics?.statusBreakdown?.rejected || 0,
      icon: <XCircle size={20} />,
      className: "rejected",
    },
  ];

  const typeData = [
    {
      label: "Full Time",
      value: analytics?.typeBreakdown?.fullTime || 0,
    },
    {
      label: "Internship",
      value: analytics?.typeBreakdown?.internship || 0,
    },
    {
      label: "Part Time",
      value: analytics?.typeBreakdown?.partTime || 0,
    },
    {
      label: "Contract",
      value: analytics?.typeBreakdown?.contract || 0,
    },
  ];

  return (
    <div className="analytics-page">
      <header className="analytics-header">
        <Link to="/dashboard" className="analytics-back-link">
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <div className="analytics-brand">
          <BarChart3 size={21} />
          <span>JobTrack</span>
        </div>
      </header>

      <main className="analytics-main">
        <div className="analytics-title">
          <div>
            <h1>Analytics</h1>
            <p>Understand your job search performance at a glance.</p>
          </div>
        </div>

        <section className="analytics-overview">
          <div className="analytics-total-card">
            <div className="analytics-total-icon">
              <BriefcaseBusiness size={24} />
            </div>

            <div>
              <span>Total Applications</span>
              <strong>{analytics?.total || 0}</strong>
            </div>
          </div>
        </section>

        <section className="analytics-section">
          <div className="analytics-section-header">
            <div>
              <h2>Application Status</h2>
              <p>Track the current status of your applications.</p>
            </div>
          </div>

          <div className="analytics-status-grid">
            {statusData.map((item) => (
              <div
                className={`analytics-status-card ${item.className}`}
                key={item.label}
              >
                <div className="analytics-status-icon">{item.icon}</div>

                <div>
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="analytics-section">
          <div className="analytics-section-header">
            <div>
              <h2>Application Type</h2>
              <p>See what types of opportunities you are applying for.</p>
            </div>
          </div>

          <div className="analytics-type-card">
            {typeData.map((item) => (
              <div className="analytics-type-row" key={item.label}>
                <div className="analytics-type-info">
                  <span>{item.label}</span>
                  <strong>{item.value}</strong>
                </div>

                <div className="analytics-progress">
                  <div
                    className="analytics-progress-bar"
                    style={{
                      width:
                        analytics?.total > 0
                          ? `${(item.value / analytics.total) * 100}%`
                          : "0%",
                    }}
                  />
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>
    </div>
  );
}

export default Analytics;
