// src/pages/SignUp.jsx
import React from "react";
import { Link } from "react-router-dom";
import FormTitle from "../components/FormTitle/FormTitle";
import InputField from "../components/InputField/InputField";

export default function SignUp() {
  return (
    <>
      <FormTitle title="WhatsApp Bot Kayıt" />
      <form>
        <InputField
          type="text"
          placeholder="Kullanıcı adınızı girin"
          id="username"
        />
        <InputField
          type="email"
          placeholder="Email adresinizi girin"
          id="email"
        />
        <InputField
          type="password"
          placeholder="Şifrenizi oluşturun"
          id="password"
        />
        <button type="submit" className="btn btn-success w-100 fw-bold">
          Kayıt Ol
        </button>
        <div className="text-center mt-3">
          <p>
            Zaten bir hesabınız var mı?{" "}
            <Link to="/sign-in" className="text-success fw-bold">
              Giriş Yap
            </Link>
          </p>
        </div>
      </form>
    </>
  );
}
