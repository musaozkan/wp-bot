// src/pages/Home.jsx
import React from "react";
import TemplateManager from "../components/TemplateManager/TemplateManager";
import SessionManager from "../components/SessionManager/SessionManager";
import NumberListManager from "../components/NumberListManager/NumberListManager";

function Home() {
  return (
    <div style={{ margin: "12px" }}>
      <div className="row gx-4 gy-4">
        <div className="col-lg-6">
          <TemplateManager />
        </div>
        <div className="col-lg-6">
          <SessionManager />
        </div>
      </div>
      <div className="row gx-4 gy-4">
        <div className="col-lg-6">
          <NumberListManager />
        </div>
      </div>
    </div>
  );
}

export default Home;
