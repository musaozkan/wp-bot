import React, { createContext, useContext, useState, useCallback } from "react";
import PropTypes from "prop-types";
import "./AlertProvider.css"; // CSS ile animasyonları tanımladık

// Alert Context
const AlertContext = createContext();

// Custom Hook to use Alert
export const useAlert = () => useContext(AlertContext);

// Alert Provider Component
export const AlertProvider = ({ children }) => {
  const [alerts, setAlerts] = useState([]);

  // Show alert
  const showAlert = useCallback((message, type = "info", duration = 5000) => {
    const id = Date.now(); // Unique ID for each alert
    setAlerts((prevAlerts) => [...prevAlerts, { id, message, type }]);

    // Auto dismiss after duration
    setTimeout(() => {
      setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
    }, duration);
  }, []);

  // Dismiss alert manually
  const dismissAlert = useCallback((id) => {
    setAlerts((prevAlerts) => prevAlerts.filter((alert) => alert.id !== id));
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert, dismissAlert }}>
      {children}
      <div className="alert-container">
        {alerts.map(({ id, message, type }) => (
          <div
            key={id}
            className={`alert alert-${type} alert-dismissible fade show alert-animated`}
            role="alert"
          >
            {message}
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => dismissAlert(id)}
            ></button>
          </div>
        ))}
      </div>
    </AlertContext.Provider>
  );
};

AlertProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
