import asyncHandler from "express-async-handler";

export const protect = asyncHandler(async (req, res, next) => {
  if (req.session && req.session.user) {
    next();
  } else {
    res.status(401);
    throw new Error("Yetkisiz erişim. Lütfen giriş yapın.");
  }
});
