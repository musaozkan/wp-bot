// src/pages/SignUp.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import FormTitle from "../components/FormTitle/FormTitle";
import InputField from "../components/InputField/InputField";
import { register } from "../services/UserService";
import { useAlert } from "../context/AlertProvider";

export default function SignUp() {
  const [credentials, setCredentials] = useState({
    name: "",
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

  const handleSubmit = (e) => {
    e.preventDefault();

    try {
      register(credentials).then((response) => {
        console.log(response);
        if (response.status === 201) {
          showAlert("Kayıt başarılı. Giriş yapabilirsiniz.", "success");
          setTimeout(() => {
            setLoggedIn(true);
          }, 1000);
        } else {
          showAlert(response.error.message, "danger");
        }
      });
    } catch (error) {
      showAlert("Bir hata oluştu. Lütfen tekrar deneyin.", "danger");
    }
  };

  return (
    <>
      <FormTitle title="WhatsApp Bot Kayıt" />
      <form onSubmit={handleSubmit}>
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
