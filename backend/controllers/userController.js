import asyncHandler from "express-async-handler";
import bcrypt from "bcryptjs";
import User from "../models/userModel.js";

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Kullanıcı zaten kayıtlı.");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await User.create({
    name,
    email,
    password: hashedPassword,
  });

  if (!user) {
    res.status(400);
    throw new Error(
      "Kullanıcı oluşturulamadı. Lütfen bilgilerinizi kontrol edin."
    );
  }

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
  });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await bcrypt.compare(password, user.password))) {
    res.status(401);
    throw new Error("Geçersiz email veya şifre.");
  }

  // Session'a kullanıcı bilgilerini ekle
  req.session.user = {
    _id: user._id,
    name: user.name,
    email: user.email,
  };

  res.status(200).json({ message: "Giriş başarılı." });
});

export const logoutUser = asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500);
      throw new Error("Çıkış sırasında bir hata oluştu.");
    }
    res.clearCookie("connect.sid", {
      path: "/",
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    }); // Session cookie'yi temizle
    res.status(200).json({ message: "Başarıyla çıkış yapıldı." });
  });
});
