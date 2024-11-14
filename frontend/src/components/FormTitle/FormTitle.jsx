// src/components/FormTitle/FormTitle.jsx
import React from "react";
import PropTypes from "prop-types";

function FormTitle({ title }) {
  return (
    <div className="text-center mb-4">
      <img
        src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg"
        alt="WhatsApp Logo"
        style={{ width: "50px" }}
        className="mb-3"
      />
      <h2 className="text-success fw-bold">{title}</h2>
    </div>
  );
}

FormTitle.propTypes = {
  title: PropTypes.string.isRequired,
};

export default FormTitle;
