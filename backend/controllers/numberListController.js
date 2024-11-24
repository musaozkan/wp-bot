import fs from "fs";
import path from "path";
import asyncHandler from "express-async-handler";

const numbersFolder = path.join(process.cwd(), "numbers");

// Ensure the user's folder exists
const ensureUserFolder = (userId) => {
  const userFolder = path.join(numbersFolder, userId);
  if (!fs.existsSync(userFolder)) {
    fs.mkdirSync(userFolder, { recursive: true });
  }
  return userFolder;
};

// Create a new list and optionally add numbers
export const createList = asyncHandler(async (req, res) => {
  const { listName, numbers } = req.body; // `numbers` should be an array
  const userId = req.session.user._id;
  const userFolder = ensureUserFolder(userId);

  const listPath = path.join(userFolder, `${listName}.txt`);
  if (fs.existsSync(listPath)) {
    res.status(400);
    throw new Error("Bu isimde bir liste zaten mevcut.");
  }

  const uniqueNumbers = [...new Set(numbers)].filter(Boolean);
  fs.writeFileSync(listPath, uniqueNumbers.join("\n") + "\n", "utf8");
  res.status(201).json({
    message: "Liste başarıyla oluşturuldu.",
    list: { listName, numbers: uniqueNumbers },
  });
});

// Get all lists for the user
export const getLists = asyncHandler(async (req, res) => {
  const userId = req.session.user._id;
  const userFolder = ensureUserFolder(userId);

  const files = fs
    .readdirSync(userFolder)
    .filter((file) => file.endsWith(".txt"));
  const lists = files.map((file) => path.basename(file, ".txt"));

  res.status(200).json({ lists });
});

// Get a specific list with its numbers
export const getList = asyncHandler(async (req, res) => {
  const userId = req.session.user._id;
  const { listName } = req.params;
  const userFolder = ensureUserFolder(userId);

  const listPath = path.join(userFolder, `${listName}.txt`);
  if (!fs.existsSync(listPath)) {
    res.status(404);
    throw new Error("Liste bulunamadı.");
  }

  const numbers = fs.readFileSync(listPath, "utf8").split("\n").filter(Boolean);
  res.status(200).json({ listName, numbers });
});

// Add a number to an existing list
export const addNumber = asyncHandler(async (req, res) => {
  const { listName, number } = req.body;
  const userId = req.session.user._id;
  const userFolder = ensureUserFolder(userId);

  const listPath = path.join(userFolder, `${listName}.txt`);
  if (!fs.existsSync(listPath)) {
    res.status(404);
    throw new Error("Liste bulunamadı.");
  }

  const existingNumbers = fs
    .readFileSync(listPath, "utf8")
    .split("\n")
    .filter(Boolean);

  if (existingNumbers.includes(number)) {
    res.status(400);
    throw new Error("Numara zaten listede mevcut.");
  }

  try {
    fs.appendFileSync(listPath, `${number}\n`, "utf8");
    res.status(200).json({ message: "Numara listeye başarıyla eklendi." });
  } catch (error) {
    res.status(500);
    throw new Error("Numara eklenirken bir hata oluştu.");
  }
});

// Remove a number from a list
export const removeNumber = asyncHandler(async (req, res) => {
  const { listName, number } = req.body;
  const userId = req.session.user._id;
  const userFolder = ensureUserFolder(userId);

  const listPath = path.join(userFolder, `${listName}.txt`);
  if (!fs.existsSync(listPath)) {
    res.status(404);
    throw new Error("Liste bulunamadı.");
  }

  const existingNumbers = fs
    .readFileSync(listPath, "utf8")
    .split("\n")
    .filter(Boolean);
  if (!existingNumbers.includes(number)) {
    res.status(400);
    throw new Error("Numara listede bulunamadı.");
  }

  const updatedNumbers = existingNumbers.filter((num) => num !== number);
  fs.writeFileSync(listPath, updatedNumbers.join("\n"), "utf8");

  res.status(200).json({ message: "Numara listeden başarıyla silindi." });
});

// Delete an entire list
export const deleteList = asyncHandler(async (req, res) => {
  const userId = req.session.user._id;
  const { listName } = req.params;
  const userFolder = ensureUserFolder(userId);

  const listPath = path.join(userFolder, `${listName}.txt`);
  if (!fs.existsSync(listPath)) {
    res.status(404);
    throw new Error("Liste bulunamadı.");
  }

  try {
    fs.unlinkSync(listPath);
    res.status(200).json({ message: "Liste başarıyla silindi." });
  } catch (error) {
    res.status(500);
    throw new Error("Liste silinirken bir hata oluştu.");
  }
});
