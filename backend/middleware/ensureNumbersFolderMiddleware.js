import fs from "fs";
import path from "path";

// Path to the numbers folder
const numbersFolder = path.join(process.cwd(), "numbers");

// Middleware to ensure the numbers folder exists
export const ensureNumbersFolder = (req, res, next) => {
  if (!fs.existsSync(numbersFolder)) {
    fs.mkdirSync(numbersFolder, { recursive: true });
  }
  next();
};
