// src/pages/SignUp.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FormTitle from "../components/FormTitle/FormTitle";
import InputField from "../components/InputField/InputField";
import { register } from "../services/UserService";

export default function SignUp() {
  const [credentials, setCredentials] = useState({
    name: "",
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
      register(credentials).then((response) => {
        console.log(response);
        if (response.status === 201) {
          setSuccess("Kayıt başarılı. Giriş yapabilirsiniz.");
          setTimeout(() => {
            navigate("/sign-in");
          }, 1000);
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
      <FormTitle title="WhatsApp Bot Kayıt" />
      <form onSubmit={handleSubmit}>
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}
        <InputField
          type="text"
          placeholder="Adınızı ve soyadınızı girin"
          id="name"
          value={credentials.name}
          onChange={handleChange}
        />
        <InputField
          type="email"
          placeholder="E-posta adresinizi girin"
          id="email"
          value={credentials.email}
          onChange={handleChange}
        />
        <InputField
          type="password"
          placeholder="Şifrenizi oluşturun"
          id="password"
          value={credentials.password}
          onChange={handleChange}
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
