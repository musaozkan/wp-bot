import React from "react";
import PropTypes from "prop-types";

function Container({ children }) {
  return (
    <main className="d-flex justify-content-center align-items-center flex-grow-1 vh-100">
      <section
        className="container p-4 shadow-lg rounded bg-white text-center"
        style={{ maxWidth: "600px" }}
      >
        {children}
      </section>
    </main>
  );
}

Container.propTypes = {
  children: PropTypes.node.isRequired,
};

export default Container;
