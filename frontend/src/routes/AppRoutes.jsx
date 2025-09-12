import React from "react";
import { Routes, Route } from "react-router-dom";
import { AuthPage, HomePage } from "./index";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/home" element={<HomePage />} />
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/conversation/:conversationId" element={<HomePage />} />
    </Routes>
  );
};

export default AppRoutes;
