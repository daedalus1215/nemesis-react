import React from "react";
import { Navigate, Outlet, Route, Routes } from "react-router-dom";
import { useAuth } from "react-oidc-context";
import { LandingPage } from "../pages/LandingPage/LandingPage";
import LoginPage from "../pages/login-page/LoginPage";
import { RegisterPage } from "../pages/RegisterPage/RegisterPage";

const AuthGuard: React.FC = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        {/* Redirect unauthenticated users trying to access protected pages */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    );
  }
  return <Outlet />;
};

export default AuthGuard;
