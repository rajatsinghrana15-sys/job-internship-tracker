import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import "../style/Register.css";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
      });

      navigate("/login");
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left Side */}
      <div className="auth-left">
        <Link to="/" className="auth-logo">
          Job<span>Track</span>
        </Link>

        <div className="auth-left-content">
          <div className="auth-icon">
            <BriefcaseBusiness size={28} />
          </div>

          <h1>
            Organize your
            <br />
            career journey.
          </h1>

          <p>
            Create your JobTrack account and keep every application, interview
            and opportunity organized in one place.
          </p>
        </div>

        <p className="auth-copyright">© 2026 JobTrack</p>
      </div>

      {/* Right Side */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-heading">
            <h2>Create your account</h2>

            <p>Start organizing your job search today.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">Full name</label>

              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={handleChange}
                required
              />
            </div>

            {/* Email */}
            <div className="form-group">
              <label htmlFor="register-email">Email address</label>

              <input
                id="register-email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            {/* Password */}
            <div className="form-group">
              <div className="password-label">
                <label htmlFor="register-password">Password</label>

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <>
                      <EyeOff size={15} />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye size={15} />
                      Show
                    </>
                  )}
                </button>
              </div>

              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Create a password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <div className="password-label">
                <label htmlFor="confirmPassword">Confirm password</label>

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <>
                      <EyeOff size={15} />
                      Hide
                    </>
                  ) : (
                    <>
                      <Eye size={15} />
                      Show
                    </>
                  )}
                </button>
              </div>

              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            {/* Submit */}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          <Link to="/login" className="auth-secondary-button">
            Sign in to JobTrack
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Register;
