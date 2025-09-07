import React from "react";
import Auth from "../components/Auth";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();

  const handleAuthSuccess = (user, token, type) => {
    console.log("Login/signup successful!", { user, token, type });
    navigate("/home"); // redirect to HomePage after login/signup
  };

  return <Auth onAuthSuccess={handleAuthSuccess} />;
};

export default AuthPage;
