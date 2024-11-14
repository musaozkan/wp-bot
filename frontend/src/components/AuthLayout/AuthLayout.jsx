// src/components/AuthLayout/AuthLayout.jsx
import React from "react";
import PropTypes from "prop-types";
import "./AuthLayout.css";

function AuthLayout({ children }) {
  return (
    <div className="auth-layout">
      <div className="auth-card">{children}</div>
    </div>
  );
}

AuthLayout.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthLayout;
