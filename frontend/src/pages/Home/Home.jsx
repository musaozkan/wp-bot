// src/pages/Home.jsx
import React, { useState } from "react";
import CreateTemplateModal from "../../components/CreateTemplateModal/CreateTemplateModal";
import "./Home.css";

function Home() {
  const [showModal, setShowModal] = useState(false);
  const [templates, setTemplates] = useState([]);
  const [selectedTemplate, setSelectedTemplate] = useState(null);

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedTemplate(null); // Düzenleme için seçilen taslağı temizle
  };

  const handleAddTemplate = (newTemplate) => {
    if (selectedTemplate) {
      // Düzenleme modunda, mevcut taslağı güncelle
      setTemplates((prevTemplates) =>
        prevTemplates.map((template) =>
          template === selectedTemplate ? newTemplate : template
        )
      );
    } else {
      // Yeni taslak ekle
      setTemplates((prevTemplates) => [...prevTemplates, newTemplate]);
    }
    handleCloseModal();
  };

  const handleEditTemplate = (index) => {
    setSelectedTemplate(templates[index]);
    handleShowModal();
  };

  const handleDeleteTemplate = (index) => {
    setTemplates((prevTemplates) =>
      prevTemplates.filter((_, i) => i !== index)
    );
  };

  const defaultImageUrl = "https://via.placeholder.com/150"; // Varsayılan resim URL'si

  return (
    <>
      <div className="home-container">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h2 className="message-templates-title">Mesaj Taslakları</h2>
          <button className="btn btn-success btn-md" onClick={handleShowModal}>
            + Mesaj Taslağı Oluştur
          </button>
        </div>

        {templates.length === 0 ? (
          <div className="no-templates-message">
            <i className="bi bi-emoji-frown"></i>
            <p>Oluşturulan Mesaj Taslağı Bulunmamaktadır!</p>
          </div>
        ) : (
          <div className="template-grid">
            {templates.map((template, index) => (
              <div key={index} className="template-card">
                <h4 className="template-title" title={template.title}>
                  {template.title}
                </h4>
                <img
                  src={
                    template.image
                      ? URL.createObjectURL(template.image)
                      : defaultImageUrl
                  }
                  alt="Template"
                  className="template-image"
                />
                <div className="template-actions">
                  <button
                    className="btn btn-outline-primary btn-sm"
                    onClick={() => handleEditTemplate(index)}
                  >
                    Düzenle
                  </button>
                  <button
                    className="btn btn-outline-danger btn-sm"
                    onClick={() => handleDeleteTemplate(index)}
                  >
                    Sil
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <CreateTemplateModal
        show={showModal}
        handleClose={handleCloseModal}
        handleAddTemplate={handleAddTemplate}
        template={selectedTemplate}
      />
    </>
  );
}

export default Home;
