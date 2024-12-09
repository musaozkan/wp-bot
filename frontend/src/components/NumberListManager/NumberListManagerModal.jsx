import React, { useState } from "react";

function NumberListManagerModal({
  selectedList,
  numbers,
  onClose,
  onRemove,
  onAdd,
}) {
  const [newNumber, setNewNumber] = useState("+90 ");
  const [error, setError] = useState("");

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

  const handleInputChange = (e) => {
    const formatted = formatPhoneNumber(e.target.value);
    setNewNumber(formatted);
    setError(
      /^\+90\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/.test(formatted)
        ? ""
        : "Geçersiz numara formatı."
    );
  };

  const handleAddNumber = () => {
    if (!error) {
      onAdd(newNumber.trim());
      setNewNumber("+90 ");
    }
  };

  return (
    <div
      className="modal fade show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">{selectedList} - Numara Düzenleme</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            {numbers.length === 0 ? (
              <div className="alert alert-info text-center">Liste boş.</div>
            ) : (
              <ul
                className="list-group overflow-auto"
                style={{ maxHeight: "300px" }}
              >
                {numbers.map((num, i) => (
                  <li
                    key={i}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {formatPhoneNumber(num)}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onRemove(num)}
                    >
                      Sil
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="input-group mt-3">
              <input
                className="form-control"
                value={newNumber}
                onChange={handleInputChange}
              />
              <button
                className="btn btn-success"
                onClick={handleAddNumber}
                disabled={!!error}
              >
                Ekle
              </button>
            </div>
            {error && <small className="text-danger">{error}</small>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default NumberListManagerModal;
