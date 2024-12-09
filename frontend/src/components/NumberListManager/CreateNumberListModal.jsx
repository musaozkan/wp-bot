import React, { useState } from "react";
import Papa from "papaparse";

function CreateNumberListModal({ onClose, onCreate }) {
  const [listName, setListName] = useState("");
  const [error, setError] = useState("");
  const [previewNumbers, setPreviewNumbers] = useState([]);

  const handleFileUpload = (e) => {
    setError("");
    const file = e.target.files[0];

    if (file) {
      Papa.parse(file, {
        complete: (results) => {
          const parsedNumbers = results.data
            .flat()
            .filter((num) => validatePhoneNumber(num));
          setPreviewNumbers(parsedNumbers);
        },
        error: () => setError("Geçersiz bir CSV dosyası yüklendi."),
      });
    }
  };

  const validatePhoneNumber = (number) => {
    const cleaned = number.replace(/\D/g, "");
    return /^\+90\d{10}$/.test(`+${cleaned}`);
  };

  const handleCreate = () => {
    if (!listName.trim()) {
      setError("Liste adı boş bırakılamaz.");
      return;
    }

    if (!previewNumbers.length) {
      setError("Geçerli numaralar eklenmemiş.");
      return;
    }

    onCreate(listName.trim(), previewNumbers);
    setListName("");
    setPreviewNumbers([]);
    setError("");
    onClose();
  };

  const handleClickOutside = (e) => {
    if (e.target.classList.contains("modal")) {
      onClose();
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned.startsWith("90")) return "+90 ";
    const formatted = cleaned
      .substring(2)
      .match(/(\d{0,3})(\d{0,3})(\d{0,2})(\d{0,2})/);
    return `+90 ${formatted[1] || ""}${formatted[2] ? ` ${formatted[2]}` : ""}${
      formatted[3] ? ` ${formatted[3]}` : ""
    }${formatted[4] ? ` ${formatted[4]}` : ""}`;
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
            <h5 className="modal-title">Yeni Liste Oluştur</h5>
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
              <label htmlFor="listName" className="form-label">
                Liste Adı
              </label>
              <input
                type="text"
                id="listName"
                className={`form-control ${
                  error.includes("Liste adı") ? "is-invalid" : ""
                }`}
                placeholder="Lütfen liste adını giriniz"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
              />
              {error.includes("Liste adı") && (
                <div className="invalid-feedback">Liste adı zorunludur.</div>
              )}
            </div>
            <div className="mb-3">
              <label htmlFor="csvUpload" className="form-label">
                CSV Dosyası Yükle
              </label>
              <input
                type="file"
                id="csvUpload"
                className={`form-control ${
                  error.includes("CSV") ? "is-invalid" : ""
                }`}
                accept=".csv"
                onChange={handleFileUpload}
              />
              {error.includes("CSV") && (
                <div className="invalid-feedback">
                  Lütfen geçerli bir CSV dosyası yükleyin.
                </div>
              )}
              <small className="form-text text-muted">
                CSV dosyasındaki her satır bir telefon numarası olarak kabul
                edilir.
              </small>
            </div>
            {previewNumbers.length > 0 && (
              <div className="mb-3">
                <h6>Önizleme ({previewNumbers.length} numara):</h6>
                <ul
                  className="list-group overflow-auto"
                  style={{ maxHeight: "200px" }}
                >
                  {previewNumbers.map((num, index) => (
                    <li key={index} className="list-group-item">
                      {formatPhoneNumber(num)}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              İptal
            </button>
            <button
              className="btn btn-success"
              onClick={handleCreate}
              disabled={!listName.trim() || !previewNumbers.length}
            >
              Oluştur
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CreateNumberListModal;
