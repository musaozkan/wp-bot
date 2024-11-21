import React from "react";
import PropTypes from "prop-types";

const SplashScreen = ({
  logo = null,
  title,
  subtitle = "",
  showSpinner = true,
}) => {
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100 bg-light">
      {logo && (
        <img
          src={logo}
          alt={`${title} Logo`}
          className="mb-4"
          style={{ width: "120px", height: "120px", objectFit: "contain" }}
        />
      )}
      <h1 className="text-success fw-bold mb-2">{title}</h1>
      {subtitle && <p className="text-secondary mb-4">{subtitle}</p>}
      {showSpinner && (
        <div className="spinner-border text-success mt-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      )}
    </div>
  );
};

SplashScreen.propTypes = {
  logo: PropTypes.string,
  title: PropTypes.string.isRequired,
  subtitle: PropTypes.string,
  showSpinner: PropTypes.bool,
};

export default SplashScreen;
