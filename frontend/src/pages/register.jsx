import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

function Register() {
  const { t } = useTranslation();

  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      // Send a POST request to register the user
      const res = await axios.post("http://localhost:5000/api/auth/register", formData, {
        headers: { "Content-Type": "application/json" }
      });

      if (res.status === 201 || res.status === 200) {
        setMessage(t("registration_success"));
        navigate("/"); // Redirect after success
      } else {
        setMessage(t("registration_failed"));
      }
    } catch (error) {
      console.error("Registration failed:", error.response);
      setMessage(t("registration_failed"));
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4 border-0" style={{ width: "24rem", borderRadius: "10px" }}>
        <div className="card-body">
          {/* Title */}
          <h2 className="fw-bold text-center text-dark mb-3">{t("create_account")}</h2>
          <p className="text-muted text-center">{t("join_us")}</p>

          {/* Registration Form */}
          <form onSubmit={handleSubmit}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label fw-semibold">{t("full_name")}</label>
              <input
                type="text"
                name="name"
                placeholder={t("enter_full_name")}
                value={formData.name}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Username */}
            <div className="mb-3">
              <label className="form-label fw-semibold">{t("username")}</label>
              <input
                type="text"
                name="username"
                placeholder={t("choose_username")}
                value={formData.username}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label fw-semibold">{t("email")}</label>
              <input
                type="email"
                name="email"
                placeholder={t("enter_email")}
                value={formData.email}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Password */}
            <div className="mb-3">
              <label className="form-label fw-semibold">{t("password")}</label>
              <input
                type="password"
                name="password"
                placeholder={t("create_password")}
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>

            {/* Register Button */}
            <button type="submit" className="btn btn-primary btn-lg w-100">
              {t("register")}
            </button>
          </form>

          {/* Success Message */}
          {message && <p className="text-center mt-3 text-success fw-bold">{message}</p>}

          {/* Already have an account? */}
          <p className="text-center mt-3">
            <small>
              {t("already_have_account")}{" "}
              <a href="/login" className="text-primary">{t("sign_in")}</a>
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Register;