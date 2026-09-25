import { Link } from "react-router-dom";
import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import {
  BarChart3,
  ClipboardList,
  Search,
  CalendarDays,
  ArrowRight,
} from "lucide-react";
import "../style/Landing.css";

function Landing() {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = () => {
    setMenuOpen(false);
  };
  return (
    <div className="landing-page">
      {/* Navbar */}
      <nav>
        <div className="logo">
          Job<span>Track</span>
        </div>

        <button
          className="hamburger"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation menu"
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className={`nav-links ${menuOpen ? "active" : ""}`}>
          <a href="#features" onClick={closeMenu}>
            Features
          </a>

          <a href="#how-it-works" onClick={closeMenu}>
            How It Works
          </a>

          <Link to="/login" onClick={closeMenu}>
            Login
          </Link>

          <Link to="/register" className="nav-button" onClick={closeMenu}>
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <div className="hero-badge">Smart Job Application Tracker</div>

          <h1>
            Track Your Job Search.
            <br />
            <span>Get Hired Faster.</span>
          </h1>

          <p>
            Keep all your job and internship applications in one place. Track
            your progress, manage interviews, and never lose track of an
            opportunity again.
          </p>

          <div className="hero-buttons">
            <Link to="/register" className="primary-btn">
              Start Tracking
              <ArrowRight size={18} />
            </Link>

            <a href="#features" className="secondary-btn">
              Explore Features
            </a>
          </div>
        </div>

        {/* Dashboard Preview */}
        <div className="dashboard-preview">
          <div className="preview-header">
            <div>
              <small>Welcome back</small>
              <h3>Your Job Dashboard</h3>
            </div>

            <div className="preview-avatar">R</div>
          </div>

          <div className="preview-stats">
            <div className="preview-card">
              <small>Total Applications</small>
              <strong>24</strong>
            </div>

            <div className="preview-card">
              <small>Interviews</small>
              <strong>6</strong>
            </div>

            <div className="preview-card">
              <small>Offers</small>
              <strong>2</strong>
            </div>
          </div>

          <div className="preview-applications">
            <div className="application-row">
              <div className="company-icon">G</div>

              <div>
                <strong>Google</strong>
                <small>Frontend Developer</small>
              </div>

              <span className="status interview">Interview</span>
            </div>

            <div className="application-row">
              <div className="company-icon">M</div>

              <div>
                <strong>Microsoft</strong>
                <small>React Developer</small>
              </div>

              <span className="status applied">Applied</span>
            </div>

            <div className="application-row">
              <div className="company-icon">A</div>

              <div>
                <strong>Amazon</strong>
                <small>MERN Developer</small>
              </div>

              <span className="status rejected">Rejected</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="features" id="features">
        <div className="section-heading">
          <span>FEATURES</span>

          <h2>
            Everything you need to manage
            <br />
            your job search
          </h2>

          <p>Stay organized and focused throughout your job hunting journey.</p>
        </div>

        <div className="feature-grid">
          {/* Feature 1 */}
          <div className="feature-card">
            <div className="feature-icon">
              <BarChart3 size={28} strokeWidth={2} />
            </div>

            <h3>Smart Dashboard</h3>

            <p>
              Get a clear overview of all your applications, interviews and
              offers.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="feature-card">
            <div className="feature-icon">
              <ClipboardList size={28} strokeWidth={2} />
            </div>

            <h3>Application Tracking</h3>

            <p>
              Store company, role, location and application details in one
              place.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="feature-card">
            <div className="feature-icon">
              <Search size={28} strokeWidth={2} />
            </div>

            <h3>Search & Filter</h3>

            <p>
              Quickly find applications by company, role or application status.
            </p>
          </div>

          {/* Feature 4 */}
          <div className="feature-card">
            <div className="feature-icon">
              <CalendarDays size={28} strokeWidth={2} />
            </div>

            <h3>Interview Management</h3>

            <p>
              Keep track of upcoming interviews and important interview details.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta">
        <h2>
          Ready to organize your
          <br />
          job search?
        </h2>

        <p>Start tracking your applications today.</p>

        <Link to="/register" className="primary-btn">
          Create Free Account
          <ArrowRight size={18} />
        </Link>
      </section>

      {/* Footer */}
      <footer>
        <div className="logo">
          Job<span>Track</span>
        </div>

        <p>© 2026 JobTrack. Built for smarter job searching.</p>
      </footer>
    </div>
  );
}

export default Landing;
