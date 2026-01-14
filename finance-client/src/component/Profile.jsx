import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { clearUser } from "../redux/userSlice";

export default function Profile() {
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.user.userId);
  const usernameInputRef = useRef(null);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    usernameInputRef.current?.focus();

    const fetchUser = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/profile/${userId}`);
        setFormData({
          username: res.data.username || "",
          email: res.data.email || "",
          password: "",
        });
      } catch (err) {
        setError("Failed to load user data.");
      }
    };

    if (userId) {
      fetchUser();
    }
  }, [userId]);

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Username is required.";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!validateEmail(formData.email)) {
      newErrors.email = "Invalid email format.";
    }

    if (formData.password && formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setMessage("");
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setMessage("");
    setError("");

    try {
      const dataToSend = {
        username: formData.username,
        email: formData.email,
      };
      if (formData.password) {
        dataToSend.password = formData.password;
      }

      await axios.put(`http://localhost:5000/api/profile/${userId}`, dataToSend);
      setMessage("Profile updated successfully.");
      setFormData((prev) => ({ ...prev, password: "" }));
    } catch (err) {
      setError(err.response?.data?.error || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("userId");
    window.location.href = "/";
  };

  const handleDeleteAccount = async () => {
    if (!window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/profile/${userId}`);
      dispatch(clearUser());
      localStorage.removeItem("userId");
      window.location.href = "/";
    } catch (err) {
      setError("Failed to delete account.");
    }
  };

  return (
    <div dir="ltr">
      <button onClick={handleLogout}>Logout</button>

      <h2>User Profile</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div>
          <label>Username:</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            ref={usernameInputRef}
            onChange={handleChange}
          />
          {errors.username && <div style={{ color: "red" }}>{errors.username}</div>}
        </div>

        <div>
          <label>Email:</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          {errors.email && <div style={{ color: "red" }}>{errors.email}</div>}
        </div>

        <div>
          <label>Password:</label>
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <label>
            <input
              type="checkbox"
              checked={showPassword}
              onChange={() => setShowPassword((prev) => !prev)}
            />
            Show Password
          </label>
          {errors.password && <div style={{ color: "red" }}>{errors.password}</div>}
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Update Profile"}
        </button>
      </form>

      <br />

      <button onClick={handleDeleteAccount} style={{ color: "red" }}>
        Delete Account
      </button>

      {message && <div style={{ color: "green" }}>{message}</div>}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </div>
  );
}


