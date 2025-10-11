// src/pages/Admindashboard/AdminForm.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import './AdminForm.css'

const AdminForm = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setError("");
      setLoading(true);

      // Firebase authentication
      await login(formData.email, formData.password);

      // Redirect to admin dashboard on successful login
      navigate("/admin121-secret");
    } catch (error) {
      // Handle different error types
      switch (error.code) {
        case "auth/user-not-found":
          setError("No admin account found with this email.");
          break;
        case "auth/wrong-password":
          setError("Incorrect password.");
          break;
        case "auth/invalid-email":
          setError("Invalid email address.");
          break;
        case "auth/too-many-requests":
          setError("Too many failed attempts. Please try again later.");
          break;
        default:
          setError("Failed to login. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-content">
      <h2>Admin Login</h2>
      <form onSubmit={handleSubmit}>
        {error && (
          <div
            className="error-message"
            style={{
              color: "red",
              marginBottom: "10px",
              padding: "8px",
              border: "1px solid red",
              borderRadius: "4px",
              backgroundColor: "#ffebee",
            }}
          >
            {error}
          </div>
        )}

        <label>
          Email:
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </label>

        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            disabled={loading}
          />
        </label>

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default AdminForm;
