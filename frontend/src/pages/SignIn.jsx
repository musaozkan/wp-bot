// src/pages/SignIn.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormTitle from "../components/FormTitle/FormTitle";
import InputField from "../components/InputField/InputField";

export default function SignIn({ onLogin }) {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(credentials);
  };

  return (
    <>
      <FormTitle title="WhatsApp Bot Giriş" />
      <form onSubmit={handleSubmit}>
        <InputField
          type="text"
          placeholder="Kullanıcı adınızı girin"
          id="username"
          value={credentials.username}
          onChange={handleChange}
        />
        <InputField
          type="password"
          placeholder="Şifrenizi girin"
          id="password"
          value={credentials.password}
          onChange={handleChange}
        />
        <button type="submit" className="btn btn-success w-100 fw-bold">
          Giriş Yap
        </button>
        <div className="d-flex justify-content-between align-items-center mt-3">
          <Link to="/forgot-password" className="text-success">
            Şifremi Unuttum?
          </Link>
          <Link to="/sign-up" className="text-success">
            Yeni hesap oluştur
          </Link>
        </div>
      </form>
    </>
  );
}
