// src/components/InputField/InputField.jsx
import React from "react";
import PropTypes from "prop-types";

function InputField({ type, placeholder, id, value, onChange }) {
  return (
    <div className="mb-3">
      <input
        type={type}
        className="form-control"
        id={id}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
      />
    </div>
  );
}

InputField.propTypes = {
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default InputField;
