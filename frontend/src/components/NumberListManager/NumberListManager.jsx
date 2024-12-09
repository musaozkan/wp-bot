import React, { useState, useEffect } from "react";
import Papa from "papaparse";
import {
  getNumbersLists,
  createNumbersList,
  deleteNumbersList,
  getNumbers,
  removeNumberFromList,
  addNumberToList,
} from "../../services/NumberService";

// Modal for Creating New Lists with CSV Import
function CreateListModal({ onClose, onCreate }) {
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
    setCsvFile(null);
    setPreviewNumbers([]);
    setError("");
  };

  const handleClickOutside = (e) => {
    if (e.target.classList.contains("modal")) {
      onClose();
    }
  };

  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned.startsWith("90")) {
      return "+90 ";
    }
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
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {error && (
              <div className="alert alert-danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
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
                className="form-control"
                placeholder="Lütfen liste adını giriniz"
                value={listName}
                onChange={(e) => setListName(e.target.value)}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="csvUpload" className="form-label">
                CSV Dosyası Yükle
              </label>
              <input
                type="file"
                id="csvUpload"
                className="form-control"
                accept=".csv"
                onChange={handleFileUpload}
              />
              <small className="form-text text-muted">
                CSV dosyasındaki her satır bir telefon numarası olarak kabul
                edilir. Numara formatı <b>+90</b> ile başlamalıdır.
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

// Modal Component for Managing Numbers
function NumberListManagerModal({
  selectedList,
  numbers,
  onClose,
  onRemove,
  onAdd,
}) {
  const [newNumber, setNewNumber] = useState("+90 ");
  const [error, setError] = useState("");

  // Format phone number to match Turkish standards
  const formatPhoneNumber = (value) => {
    const cleaned = value.replace(/\D/g, ""); // Remove non-numeric characters
    if (!cleaned.startsWith("90")) {
      return "+90 ";
    }
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

    if (/^\+90\s\d{3}\s\d{3}\s\d{2}\s\d{2}$/.test(formatted)) {
      setError("");
    } else {
      setError("Lütfen geçerli bir numara giriniz.");
    }
  };

  const handleAddNumber = () => {
    if (!error && newNumber.trim()) {
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
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {numbers.length === 0 ? (
              <div className="alert alert-info text-center">
                <i className="bi bi-emoji-frown me-2"></i>Bu listede numara
                bulunmamaktadır!
              </div>
            ) : (
              <ul
                className="list-group mb-3 overflow-auto"
                style={{ maxHeight: "300px" }}
              >
                {numbers.map((number, index) => (
                  <li
                    key={index}
                    className="list-group-item d-flex justify-content-between align-items-center"
                  >
                    {formatPhoneNumber(number)}
                    <button
                      className="btn btn-sm btn-danger"
                      onClick={() => onRemove(number)}
                    >
                      <i className="bi bi-trash"></i>
                    </button>
                  </li>
                ))}
              </ul>
            )}
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="Yeni numara ekle (Ör: +90 555 555 55 55)"
                value={newNumber}
                onChange={handleInputChange}
              />
              <button
                className="btn btn-success"
                onClick={handleAddNumber}
                disabled={!!error || !newNumber.trim()}
              >
                <i className="bi bi-plus-circle"></i> Ekle
              </button>
            </div>
            {error && <small className="text-danger">{error}</small>}
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Kapat
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Main Component for Managing Lists
function NumberListManager() {
  const [lists, setLists] = useState([]);
  const [selectedList, setSelectedList] = useState(null);
  const [numbers, setNumbers] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchLists();
  }, []);

  const fetchLists = async () => {
    try {
      const response = await getNumbersLists();
      setLists(response.status === 200 ? response.data.lists : []);
    } catch (error) {
      console.error("Hata:", error.response?.message || error.message);
    }
  };

  const handleCreateList = async (listName, numbers) => {
    try {
      await createNumbersList(listName, numbers);
      fetchLists();
      setShowCreateModal(false);
    } catch (error) {
      console.error("Hata:", error.response?.message || error.message);
    }
  };

  const handleDeleteList = async (listName) => {
    try {
      await deleteNumbersList(listName);
      fetchLists();
    } catch (error) {
      console.error("Hata:", error.response?.message || error.message);
    }
  };

  const handleEditList = async (listName) => {
    setSelectedList(listName);
    try {
      const response = await getNumbers(listName);
      setNumbers(response.status === 200 ? response.data.numbers : []);
    } catch (error) {
      console.error("Hata:", error.response?.message || error.message);
    }
  };

  const handleCloseModal = () => {
    setSelectedList(null);
    setNumbers([]);
  };

  return (
    <div className="p-4 bg-light rounded shadow">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>İletişim Listeleri Yönetimi</h2>
        <button
          className="btn btn-success"
          onClick={() => setShowCreateModal(true)}
        >
          + Yeni Liste Oluştur
        </button>
      </div>

      {lists.length === 0 ? (
        <div className="alert alert-info text-center">
          <i className="bi bi-emoji-frown me-2"></i>Henüz liste bulunmamaktadır!
        </div>
      ) : (
        <ul className="list-group overflow-auto" style={{ maxHeight: "150px" }}>
          {lists.map((list) => (
            <li
              key={list}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {list}
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEditList(list)}
                >
                  Düzenle
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteList(list)}
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      {showCreateModal && (
        <CreateListModal
          onClose={() => setShowCreateModal(false)}
          onCreate={handleCreateList}
        />
      )}

      {selectedList && (
        <NumberListManagerModal
          selectedList={selectedList}
          numbers={numbers}
          onClose={handleCloseModal}
          onRemove={async (number) => {
            try {
              await removeNumberFromList(selectedList, number);
              setNumbers(numbers.filter((num) => num !== number));
            } catch (error) {
              console.error("Hata:", error.response?.message || error.message);
            }
          }}
          onAdd={async (number) => {
            try {
              await addNumberToList(selectedList, number);
              setNumbers([...numbers, number]);
            } catch (error) {
              console.error("Hata:", error.response?.message || error.message);
            }
          }}
        />
      )}
    </div>
  );
}

export default NumberListManager;
