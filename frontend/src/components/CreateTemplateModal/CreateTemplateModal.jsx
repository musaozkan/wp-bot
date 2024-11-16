// src/components/CreateTemplateModal/CreateTemplateModal.jsx
import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";

function CreateTemplateModal({
  show,
  handleClose,
  handleAddTemplate,
  template,
}) {
  const [templateData, setTemplateData] = useState({
    title: "",
    message: "",
    image: null,
  });

  const fileInputRef = useRef(null);

  useEffect(() => {
    if (template) {
      setTemplateData(template);
    } else {
      setTemplateData({ title: "", message: "", image: null });
    }
  }, [template]);

  useEffect(() => {
    if (!show) {
      setTemplateData({ title: "", message: "", image: null });
    }
  }, [show]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTemplateData((prevTemplate) => ({ ...prevTemplate, [name]: value }));
  };

  const handleImageChange = (e) => {
    setTemplateData((prevTemplate) => ({
      ...prevTemplate,
      image: e.target.files[0],
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleAddTemplate(templateData);
    setTemplateData({ title: "", message: "", image: null });
    fileInputRef.current.value = "";
    handleClose();
  };

  const closeModal = () => {
    handleClose();
  };

  const handleOutsideClick = (e) => {
    if (e.target.classList.contains("modal-overlay")) {
      closeModal();
    }
  };

  return (
    <div
      className={`modal fade ${show ? "show" : ""}`}
      style={{
        display: show ? "block" : "none",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
      }}
      tabIndex="-1"
      role="dialog"
      aria-labelledby="createTemplateModal"
      aria-hidden="true"
      onClick={handleOutsideClick}
    >
      <div
        className="modal-dialog modal-dialog-centered modal-lg"
        role="document"
      >
        <div className="modal-content border-0 shadow">
          <div className="modal-header">
            <h5 className="modal-title fw-bold">
              {template ? "Taslağı Düzenle" : "Taslak Ekle"}
            </h5>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={closeModal}
            ></button>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label fw-semibold">Başlık</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Mesaj başlığı.."
                  name="title"
                  value={templateData.title}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Mesaj</label>
                <textarea
                  className="form-control"
                  rows="3"
                  placeholder="Lütfen göndermek istediğiniz mesajınızı yazınız.."
                  name="message"
                  value={templateData.message}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="mb-3">
                {templateData.image ? (
                  <div className="d-flex justify-content-center align-items-center">
                    <div className="justify-content-center align-items-center position-relative d-inline-flex">
                      <img
                        src={URL.createObjectURL(templateData.image)}
                        alt="template"
                        className="rounded shadow"
                        style={{
                          width: "150px",
                          height: "150px",
                          objectFit: "cover",
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-danger btn-sm rounded-circle position-absolute"
                        style={{
                          top: "0",
                          right: "0",
                          transform: "translate(40%, -40%)",
                        }}
                        onClick={() =>
                          setTemplateData((prevTemplate) => ({
                            ...prevTemplate,
                            image: null,
                          }))
                        }
                      >
                        <i className="bi bi-x fs-6"></i>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor="imageUpload"
                      className="form-label fw-semibold"
                    >
                      Resim Ekle
                    </label>
                    <input
                      type="file"
                      id="imageUpload"
                      className="form-control"
                      accept="image/*"
                      ref={fileInputRef}
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-outline-secondary"
                onClick={closeModal}
              >
                Kapat
              </button>
              <button type="submit" className="btn btn-success">
                {template ? "Güncelle" : "Oluştur"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

CreateTemplateModal.propTypes = {
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  handleAddTemplate: PropTypes.func.isRequired,
  template: PropTypes.object,
};

export default CreateTemplateModal;
