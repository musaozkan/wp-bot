import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import {
  createSession,
  cancelOrDeleteSession,
  getSessions,
} from "../../services/SessionService";

function CreateSessionModal({ onClose, onCreate }) {
  const [sessionName, setSessionName] = useState("");
  const [error, setError] = useState("");

  const handleCreate = () => {
    if (!sessionName.trim()) {
      setError("Oturum adı boş bırakılamaz.");
      return;
    }

    onCreate(sessionName.trim());
    setSessionName("");
    setError("");
    onClose();
  };

  const handleClickOutside = (e) => {
    if (e.target.classList.contains("modal")) {
      onClose();
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
      onClick={handleClickOutside}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Yeni Oturum Oluştur</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}
            <div className="mb-3">
              <label htmlFor="sessionName" className="form-label">
                Oturum Adı
              </label>
              <input
                type="text"
                id="sessionName"
                className={`form-control ${
                  error.includes("Oturum adı") ? "is-invalid" : ""
                }`}
                placeholder="Lütfen oturum adını giriniz"
                value={sessionName}
                onChange={(e) => setSessionName(e.target.value)}
              />
              {error.includes("Oturum adı") && (
                <div className="invalid-feedback">Oturum adı zorunludur.</div>
              )}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              İptal
            </button>
            <button
              className="btn btn-success"
              onClick={handleCreate}
              disabled={!sessionName}
            >
              Oluştur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function AuthenticationModal({ onClose, taskId }) {
  const [error, setError] = useState("");
  const [qrStatus, setQrStatus] = useState("");
  const [qrCode, setQrCode] = useState("");

  useEffect(() => {
    const handleSseQrStatus = async () => {
      try {
        const url = serverUrl + "/sessions/qr-status/" + taskId;
        const eventSource = new EventSource(url);

        eventSource.addEventListener("message", (e) => {
          const parsedMessage = JSON.parse(e.data);
          if (parsedMessage.status === "qr-received") {
            setQrCode(parsedMessage.qr);
            setQrStatus(parsedMessage.status);
          } else if (parsedMessage.status === "client-ready") {
            eventSource.close();
            onClose();
          }
        });
      } catch (err) {
        console.error("Failed to receive QR status:", err);
      }
    };

    handleSseQrStatus();
  }, [taskId]);

  const handleCancel = async () => {
    try {
      if (qrStatus === "qr-received") {
        const response = await cancelOrDeleteSession(taskId, "cancel");
        if (response.status === 200) {
          onClose();
          return;
        } else {
          setError("Oturum oluşturma işlemi iptal edilemedi.");
        }
      }
      onClose();
    } catch (err) {
      setError("Oturum oluşturma işlemi iptal edilemedi.");
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Oturum Kimlik Doğrulama</h5>
            <button
              className="btn-close"
              disabled={!qrCode}
              onClick={handleCancel}
            ></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger d-flex align-items-center">
                <i className="bi bi-exclamation-triangle-fill me-2"></i>
                {error}
              </div>
            )}
            <div className="mb-3 text-center">
              <div id="qrCode" className="d-flex justify-content-center">
                {qrCode ? (
                  <QRCode value={qrCode} size={256} />
                ) : (
                  <div
                    className="spinner-border text-success"
                    role="status"
                  ></div>
                )}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-secondary"
              disabled={!qrCode}
              onClick={handleCancel}
            >
              İptal
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function SessionManager() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [taskId, setTaskId] = useState(null);

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await getSessions();
      if (response.status === 200) {
        setSessions(response.data);
      } else {
        console.error("Failed to fetch sessions:", response.data.message);
      }
    } catch (err) {
      console.error("Failed to fetch sessions:", err);
    }
  };

  const handleCreateSession = async (sessionName) => {
    try {
      const response = await createSession(sessionName);
      if (response.status === 200) {
        setTaskId(response.data.taskId);
        setShowAuthModal(true);
      } else {
        console.error("Failed to create session:", response.data.message);
      }
    } catch (err) {
      console.error("Failed to create session:", err);
    }
  };

  return (
    <div className="p-4 bg-light rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>WhatsApp Oturumları Yönetimi</h2>
        <button
          className="btn btn-success"
          onClick={() => setShowCreateModal(true)}
        >
          + Yeni Oturum
        </button>
      </div>
      {sessions.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <i className="bi bi-emoji-frown me-2"></i>Oluşturulan oturum
          bulunmamaktadır!
        </div>
      ) : (
        <ul className="list-group overflow-auto" style={{ maxHeight: "150px" }}>
          {sessions.map((session) => (
            <li
              key={session._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {session.name}
              <div>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => {
                    cancelOrDeleteSession(session.taskId, "delete")
                      .then(() => fetchSessions())
                      .catch((err) =>
                        console.error("Failed to delete session:", err)
                      );
                  }}
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
      {showCreateModal && (
        <CreateSessionModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateSession}
        />
      )}
      {showAuthModal && (
        <AuthenticationModal
          onClose={() => {
            setShowAuthModal(false);
            fetchSessions();
          }}
          taskId={taskId}
        />
      )}
    </div>
  );
}

export default SessionManager;
