// src/components/TemplateManager/TemplateManager.jsx
import React, { useState, useEffect } from "react";
import CreateTemplateModal from "../CreateTemplateModal/CreateTemplateModal";
import {
  getTemplates,
  getTemplateById,
  deleteTemplate,
} from "../../services/TemplateService";

function TemplateManager() {
  const [showModal, setShowModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  useEffect(() => {
    refreshTemplates();
  }, []);

  const refreshTemplates = () => {
    try {
      getTemplates().then((response) => {
        if (response.status === 200) {
          setTemplates(response.data);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTemplate(null);
  };

  const handleEditTemplate = (index) => {
    try {
      getTemplateById(index).then((response) => {
        if (response.status === 200) {
          setSelectedTemplate(response.data.template);
          setShowModal(true);
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteTemplate = (index) => {
    try {
      deleteTemplate(index).then((response) => {
        if (response.status === 200) {
          refreshTemplates();
        }
      });
    } catch (error) {
      console.error(error);
    }
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
              key={template._id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              {template.title}
              <div>
                <button
                  className="btn btn-sm btn-warning me-2"
                  onClick={() => handleEditTemplate(template._id)}
                >
                  Düzenle
                </button>
                <button
                  className="btn btn-sm btn-danger"
                  onClick={() => handleDeleteTemplate(template._id)}
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
        refreshTemplates={refreshTemplates}
        template={selectedTemplate}
      />
    </div>
  );
}

export default TemplateManager;
