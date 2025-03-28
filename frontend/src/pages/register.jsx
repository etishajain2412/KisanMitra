import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Cookies from "js-cookie";

const Register = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    roles: "user",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const errorMessage = params.get("error");
    if (errorMessage) {
      setError(errorMessage);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccessMessage("");

    if (!formData.username || !formData.name || !formData.email || !formData.password) {
      setError("All fields are required");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        { ...formData, roles: [formData.roles] },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      setSuccessMessage(response.data.message || "Registration successful! Redirecting...");
      setTimeout(() => navigate("/profile"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleAuth = (isRegister) => {
    Cookies.set("authState", isRegister ? "register" : "login", { expires: 1 });
    window.location.href = "http://localhost:5000/api/auth/google";
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4 border-0" style={{ width: "24rem", borderRadius: "10px" }}>
        <div className="card-body">
          <h2 className="fw-bold text-center text-dark mb-3">Create an Account</h2>
          <p className="text-muted text-center">Join us today and explore the platform!</p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label fw-semibold">Full Name</label>
              <input type="text" name="name" placeholder="Enter your full name" value={formData.name} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Username</label>
              <input type="text" name="username" placeholder="Choose a username" value={formData.username} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Email</label>
              <input type="email" name="email" placeholder="Enter your email" value={formData.email} onChange={handleChange} className="form-control" required />
            </div>
            <div className="mb-3">
              <label className="form-label fw-semibold">Password</label>
              <input type="password" name="password" placeholder="Create a password" value={formData.password} onChange={handleChange} className="form-control" required />
            </div>
            <button type="submit" className="btn btn-primary btn-lg w-100" disabled={loading}>
              {loading ? "Registering..." : "Register"}
            </button>
          </form>

          {error && <p className="text-center mt-3 text-danger fw-bold">{error}</p>}
          {successMessage && <p className="text-center mt-3 text-success fw-bold">{successMessage}</p>}

          <div className="text-center my-3">OR</div>

          <div className="d-flex justify-content-center">
            <button
              onClick={() => handleGoogleAuth(true)}
              className="btn btn-outline-primary w-100"
              style={{ backgroundColor: "#4285F4", color: "white" }}
            >
              Register with Google
            </button>
          </div>

          <p className="text-center mt-3">
            <small>Already have an account? <a href="/login" className="text-primary">Sign in</a></small>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
