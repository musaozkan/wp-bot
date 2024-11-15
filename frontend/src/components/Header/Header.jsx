// src/components/Header.jsx
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import "./Header.css";

function Header({ title, onLogout, navLinks }) {
  return (
    <header className="header-card shadow-sm">
      <div className="header-content d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp Logo"
            className="whatsapp-icon"
          />
          <h1 className="header-title">{title}</h1>
        </div>
        <nav className="navbar">
          <ul className="nav">
            {navLinks.map((link) => (
              <li key={link.name} className="nav-item">
                <Link to={link.path} className="nav-link">
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button className="btn btn-outline-success btn-md" onClick={onLogout}>
          Çıkış Yap
        </button>
      </div>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  onLogout: PropTypes.func.isRequired,
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Header;
