import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Settings as SettingsIcon,
  User,
  Lock,
  Save,
} from "lucide-react";
import axios from "axios";

import "../style/Settings.css";

function Settings() {
  const [profile, setProfile] = useState({
    name: "",
    email: "",
  });

  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const [profileMessage, setProfileMessage] = useState("");
  const [passwordMessage, setPasswordMessage] = useState("");

  const [profileError, setProfileError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem("token");

      const response = await axios.get("http://localhost:5000/api/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setProfile({
        name: response.data.name,
        email: response.data.email,
      });
    } catch (error) {
      setProfileError(
        error.response?.data?.message || "Failed to load profile.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (event) => {
    setProfile({
      ...profile,
      [event.target.name]: event.target.value,
    });
  };

  const handlePasswordChange = (event) => {
    setPasswords({
      ...passwords,
      [event.target.name]: event.target.value,
    });
  };

  const handleProfileSubmit = async (event) => {
    event.preventDefault();

    setProfileMessage("");
    setProfileError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/api/auth/profile",
        profile,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setProfileMessage(response.data.message);

      localStorage.setItem("user", JSON.stringify(response.data.user));
    } catch (error) {
      setProfileError(
        error.response?.data?.message || "Failed to update profile.",
      );
    }
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    setPasswordMessage("");
    setPasswordError("");

    try {
      const token = localStorage.getItem("token");

      const response = await axios.put(
        "http://localhost:5000/api/auth/password",
        passwords,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setPasswordMessage(response.data.message);

      setPasswords({
        currentPassword: "",
        newPassword: "",
      });
    } catch (error) {
      setPasswordError(
        error.response?.data?.message || "Failed to change password.",
      );
    }
  };

  return (
    <div className="settings-page">
      <header className="settings-header">
        <Link to="/dashboard" className="settings-back-link">
          <ArrowLeft size={18} />
          Dashboard
        </Link>

        <div className="settings-brand">
          <SettingsIcon size={21} />
          <span>JobTrack</span>
        </div>
      </header>

      <main className="settings-main">
        <div className="settings-title">
          <h1>Settings</h1>
          <p>Manage your profile and account security.</p>
        </div>

        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              <User size={20} />
            </div>

            <div>
              <h2>Profile Information</h2>
              <p>Update your name and email address.</p>
            </div>
          </div>

          {loading ? (
            <div className="settings-loading">Loading profile...</div>
          ) : (
            <form className="settings-form" onSubmit={handleProfileSubmit}>
              <div className="settings-field">
                <label htmlFor="name">Full Name</label>

                <input
                  id="name"
                  name="name"
                  type="text"
                  value={profile.name}
                  onChange={handleProfileChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="settings-field">
                <label htmlFor="email">Email Address</label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  placeholder="Enter your email"
                  required
                />
              </div>

              {profileMessage && (
                <div className="settings-success">{profileMessage}</div>
              )}

              {profileError && (
                <div className="settings-error">{profileError}</div>
              )}

              <button type="submit" className="settings-save-btn">
                <Save size={17} />
                Save Changes
              </button>
            </form>
          )}
        </section>

        <section className="settings-card">
          <div className="settings-card-header">
            <div className="settings-card-icon">
              <Lock size={20} />
            </div>

            <div>
              <h2>Change Password</h2>
              <p>Keep your account secure with a strong password.</p>
            </div>
          </div>

          <form className="settings-form" onSubmit={handlePasswordSubmit}>
            <div className="settings-field">
              <label htmlFor="currentPassword">Current Password</label>

              <input
                id="currentPassword"
                name="currentPassword"
                type="password"
                value={passwords.currentPassword}
                onChange={handlePasswordChange}
                placeholder="Enter current password"
                required
              />
            </div>

            <div className="settings-field">
              <label htmlFor="newPassword">New Password</label>

              <input
                id="newPassword"
                name="newPassword"
                type="password"
                value={passwords.newPassword}
                onChange={handlePasswordChange}
                placeholder="Enter new password"
                minLength={6}
                required
              />
            </div>

            {passwordMessage && (
              <div className="settings-success">{passwordMessage}</div>
            )}

            {passwordError && (
              <div className="settings-error">{passwordError}</div>
            )}

            <button type="submit" className="settings-save-btn">
              <Lock size={17} />
              Update Password
            </button>
          </form>
        </section>
      </main>
    </div>
  );
}

export default Settings;
