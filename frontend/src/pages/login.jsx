import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

function Login() {
  const { t } = useTranslation();
  const [formData, setFormData] = useState({
    identifier: '',  // handles email or username
    password: ''
  });

  const navigate = useNavigate();

  // Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Data:', formData);

    try {
      const res = await axios.post('http://localhost:5000/api/auth/login', formData, {
        headers: { 'Content-Type': 'application/json' },
      });
      console.log(res.data);
      localStorage.setItem('token', res.data.token); // Save token
      navigate('/'); // Redirect after login
    } catch (error) {
      console.error('Login failed:', error.response);
      alert(t("login_failed") + ": " + error.response.data.message);
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div className="card shadow-lg p-4 border-0" style={{ width: "22rem", borderRadius: "10px" }}>
        <div className="card-body">
          {/* Title */}
          <h2 className="fw-bold text-center text-dark mb-3">{t("login_title")}</h2>
          <p className="text-muted text-center">{t("login_subtitle")}</p>
  
          {/* Login Form */}
          <form onSubmit={handleSubmit}>
            {/* Email/Username */}
            <div className="mb-3">
              <label className="form-label fw-semibold">{t("email_or_username")}</label>
              <input
                type="text"
                name="identifier"
                placeholder={t("enter_email_or_username")}
                value={formData.identifier}
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
                placeholder={t("enter_password")}
                value={formData.password}
                onChange={handleChange}
                className="form-control"
                required
              />
            </div>
  
            {/* Login Button */}
            <button type="submit" className="btn btn-primary btn-lg w-100">
              {t("login_button")}
            </button>
          </form>
  
          {/* Register Link */}
          <p className="text-center mt-3">
            <small>
              {t("dont_have_account")} <a href="/register" className="text-primary">{t("sign_up")}</a>
            </small>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
