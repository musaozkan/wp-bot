// src/pages/ForgotPassword.jsx
import React from "react";
import { Link } from "react-router-dom";
import FormTitle from "../components/FormTitle/FormTitle";
import InputField from "../components/InputField/InputField";

export default function ForgotPassword() {
  return (
    <>
      <FormTitle title="Şifremi Unuttum" />
      <form>
        <InputField
          type="email"
          placeholder="Email adresinizi girin"
          id="email"
        />
        <button type="submit" className="btn btn-success w-100 fw-bold">
          Şifre Sıfırlama Bağlantısı Gönder
        </button>
        <div className="text-center mt-3">
          <Link to="/sign-in" className="text-success fw-bold">
            Giriş Sayfasına Dön
          </Link>
        </div>
      </form>
    </>
  );
}
