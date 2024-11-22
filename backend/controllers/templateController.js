import asyncHandler from "express-async-handler";
import Template from "../models/templateModel.js";
import path from "path";
import fs from "fs";

// Create template
export const createTemplate = asyncHandler(async (req, res) => {
  const { title, message } = req.body;

  if (!title || !message) {
    res.status(400);
    throw new Error("Başlık ve mesaj alanları zorunludur.");
  }

  const template = await Template.create({
    user: req.session.user._id,
    title,
    message,
    image: req.file ? path.basename(req.file.path) : null,
  });

  res.status(201).json(template);
});

// Get templates
export const getTemplates = asyncHandler(async (req, res) => {
  const templates = await Template.find({ user: req.session.user._id });
  res.status(200).json(templates);
});

// Get Template by ID
export const getTemplateById = asyncHandler(async (req, res) => {
  const templateId = req.params.id;

  const template = await Template.findById(templateId);

  if (!template) {
    res.status(404);
    throw new Error("Template bulunamadı.");
  }

  if (template.user.toString() !== req.session.user._id) {
    res.status(403);
    throw new Error("Bu template üzerinde işlem yapma yetkiniz yok.");
  }

  const imagePath = template.image
    ? path.join("templates", template.image)
    : null;

  let imageBase64 = null;
  if (imagePath && fs.existsSync(imagePath)) {
    const imageBuffer = fs.readFileSync(imagePath);
    imageBase64 = imageBuffer.toString("base64");
  }

  res.status(200).json({
    template: {
      _id: template._id,
      title: template.title,
      message: template.message,
      image: imageBase64 ? `data:image/jpeg;base64,${imageBase64}` : null,
      createdAt: template.createdAt,
      updatedAt: template.updatedAt,
    },
  });
});

// Edit template
export const editTemplate = asyncHandler(async (req, res) => {
  const { title, message, removeImage } = req.body;
  const templateId = req.params.id;

  const template = await Template.findById(templateId);

  if (!template) {
    res.status(404);
    throw new Error("Template bulunamadı.");
  }

  if (template.user.toString() !== req.session.user._id) {
    res.status(403);
    throw new Error("Bu template üzerinde işlem yapma yetkiniz yok.");
  }

  if (req.file) {
    if (template.image) {
      const existingImagePath = path.join("templates", template.image);
      if (fs.existsSync(existingImagePath)) {
        fs.unlinkSync(existingImagePath);
      }
    }
    template.image = req.file.filename;
  }

  if (removeImage === "true" || removeImage === true) {
    if (template.image) {
      const existingImagePath = path.join("templates", template.image);
      if (fs.existsSync(existingImagePath)) {
        fs.unlinkSync(existingImagePath);
      }
      template.image = null;
    }
  }

  template.title = title || template.title;
  template.message = message || template.message;

  const updatedTemplate = await template.save();

  res.status(200).json({
    message: "Template başarıyla güncellendi.",
    template: updatedTemplate,
  });
});

// Delete template
export const deleteTemplate = asyncHandler(async (req, res) => {
  const template = await Template.findById(req.params.id);

  if (!template) {
    res.status(404);
    throw new Error("Template bulunamadı.");
  }

  if (template.user.toString() !== req.session.user._id) {
    res.status(403);
    throw new Error("Bu template üzerinde işlem yapma yetkiniz yok.");
  }

  if (template.image) {
    const imagePath = path.join("templates", template.image);
    if (fs.existsSync(imagePath)) {
      fs.unlinkSync(imagePath);
    }
  }

  await Template.deleteOne({ _id: req.params.id });

  res.status(200).json({ message: "Template başarıyla silindi." });
});
