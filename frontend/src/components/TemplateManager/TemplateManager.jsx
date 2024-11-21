// src/components/TemplateManager/TemplateManager.jsx
import React, { useState } from "react";
import CreateTemplateModal from "../CreateTemplateModal/CreateTemplateModal";

function TemplateManager() {
  const [showModal, setShowModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTemplate(null);
  };

  const handleAddTemplate = (newTemplate) => {
    let updatedTemplates;
    if (selectedTemplate) {
      updatedTemplates = templates.map((template) =>
        template === selectedTemplate ? newTemplate : template
      );
    } else {
      updatedTemplates = [...templates, newTemplate];
    }
    setTemplates(updatedTemplates);
    handleCloseModal();
  };

  const handleEditTemplate = (index) => {
    setSelectedTemplate(templates[index]);
    handleShowModal();
  };

  const handleDeleteTemplate = (index) => {
    const updatedTemplates = templates.filter((_, i) => i !== index);
    setTemplates(updatedTemplates);
  };

  return (
    <div className="p-4 bg-light rounded shadow-sm mb-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Mesaj Taslağı Yöneticisi</h2>
        <button className="btn btn-success" onClick={handleShowModal}>
          + Mesaj Taslağı Oluştur
        </button>
      </div>
      {templates.length === 0 ? (
        <div className="alert alert-info text-center" role="alert">
          <i className="bi bi-emoji-frown me-2"></i>Oluşturulan Mesaj Taslağı
          Bulunmamaktadır!
        </div>
      ) : (
        <ul className="list-group overflow-auto" style={{ maxHeight: "200px" }}>
          {templates.map((template, index) => (
            <li
              key={index}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {template.title}
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEditTemplate(index)}
                >
                  Düzenle
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteTemplate(index)}
                >
                  Sil
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <CreateTemplateModal
        show={showModal}
        handleClose={handleCloseModal}
        handleAddTemplate={handleAddTemplate}
        template={selectedTemplate}
      />
    </div>
  );
}

export default TemplateManager;
