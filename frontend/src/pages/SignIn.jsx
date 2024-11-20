// src/pages/SignIn.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormTitle from "../components/FormTitle/FormTitle";
import InputField from "../components/InputField/InputField";
import { login } from "../services/UserService";

export default function SignIn({ setLoggedIn }) {
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [id]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      login(credentials).then((response) => {
        if (response.status === 200) {
          console.log(response);
          setSuccess(response.data.message);
          setLoggedIn(true);
          navigate("/");
        } else {
          setError(response.error.message);
        }
      });
    } catch (error) {
      setError("Bir hata oluştu. Lütfen tekrar deneyin.");
    }
  };

  return (
    <>
      <FormTitle title="WhatsApp Bot Giriş" />
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <InputField
          type="mail"
          placeholder="Kullanıcı adınızı girin"
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
