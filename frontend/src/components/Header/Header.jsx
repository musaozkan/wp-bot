// src/components/Header.jsx
import React from "react";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { logout } from "../../services/UserService";

function Header({ title, handleLogout, navLinks }) {
  const logoutUser = async () => {
    try {
      logout().then((response) => {
        if (response.status === 200) {
          handleLogout();
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <header
      style={{
        margin: "12px",
      }}
      className="bg-light shadow-sm p-3 rounded sticky-top"
    >
      <div className="container-fluid d-flex align-items-center justify-content-between">
        <div className="d-flex align-items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
            alt="WhatsApp Logo"
            className="me-3"
            style={{ width: "36px", height: "36px" }}
          />
          <h1 className="h4 text-success m-0">{title}</h1>
        </div>
        <nav className="d-flex align-items-center">
          <ul className="navbar-nav flex-row">
            {navLinks.map((link) => (
              <li key={link.name} className="nav-item">
                <Link
                  to={link.path}
                  className="nav-link text-success fw-semibold mx-2"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <button className="btn btn-outline-success" onClick={logoutUser}>
          Çıkış Yap
        </button>
      </div>
    </header>
  );
}

Header.propTypes = {
  title: PropTypes.string.isRequired,
  handleLogout: PropTypes.func.isRequired,
  navLinks: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default Header;
