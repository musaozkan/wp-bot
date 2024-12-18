// src/components/SessionManager/SessionManager.jsx
import React, { useState } from "react";

function SessionManager() {
  const [showModal, setShowModal] = useState(false);
  const [sessions, setSessions] = useState([]);

  const handleShowModal = () => setShowModal(true);
  return (
    <div className="p-4 bg-light rounded shadow-sm mb-4">
      <h2>Hesap ve Oturum Yönetimi</h2>
      <p className="text-muted">
        Burada oturum yönetimi işlemlerini yapabilirsiniz.
      </p>
      {/* Session list and management options can be added here */}
    </div>
  );
}

export default SessionManager;
