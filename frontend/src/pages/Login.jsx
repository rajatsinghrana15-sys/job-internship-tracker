import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, BriefcaseBusiness, Eye, EyeOff } from "lucide-react";
import axios from "axios";
import "../style/Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
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
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        formData,
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response.data.user));

      navigate("/dashboard");
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again.",
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
            Take control of
            <br />
            your job search.
          </h1>

          <p>
            Track applications, manage interviews and stay organized throughout
            your career journey.
          </p>
        </div>

        <p className="auth-copyright">© 2026 JobTrack</p>
      </div>

      {/* Right Side */}
      <div className="auth-right">
        <div className="auth-card">
          <div className="auth-heading">
            <h2>Welcome back</h2>

            <p>Sign in to continue to your JobTrack account.</p>
          </div>

          {error && <div className="auth-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">Email address</label>

              <input
                id="email"
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
                <label htmlFor="password">Password</label>

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

              <div className="password-input">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            {/* Submit */}
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}

              {!loading && <ArrowRight size={18} />}
            </button>
          </form>

          <div className="auth-divider">
            <span>New to JobTrack?</span>
          </div>

          <Link to="/register" className="auth-secondary-button">
            Create an account
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
