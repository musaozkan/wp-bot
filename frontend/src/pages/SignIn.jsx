import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormTitle from "../components/FormTitle/FormTitle";
import InputField from "../components/InputField/InputField";
import { login } from "../services/UserService";
import { useAlert } from "../context/AlertProvider";

export default function SignIn({ handleLogin }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const { showAlert } = useAlert();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await login(credentials);
      if (response.status === 200) {
        showAlert(response.data.message, "success");
        handleLogin();
      } else {
        showAlert(response.error.message, "danger");
      }
    } catch (error) {
      showAlert("Bir hata oluştu. Lütfen tekrar deneyin.", "danger");
    }
  };

  return (
    <>
      <FormTitle title="WhatsApp Bot Giriş" />
      <form onSubmit={handleSubmit}>
        <InputField
          type="email"
          placeholder="E-posta adresinizi girin"
          id="email"
          value={credentials.email}
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
          <Link to="/sign-up" className="text-success">
            Yeni hesap oluştur
          </Link>
        </div>
      </form>
    </>
  );
}
