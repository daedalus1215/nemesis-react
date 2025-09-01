import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { LoginPage } from "./pages/LoginPage/LoginPage";

import { useAuth } from "./auth/useAuth";
import { LandingPage } from "./pages/LandingPage/LandingPage";
import { RegisterPage } from "./pages/RegisterPage/RegisterPage";
import { AuthProvider } from "./auth/AuthContext";
import { ScrollProvider } from "./context/ScrollContext";
import { HomePage } from "./pages/HomePage/HomePage";
import { MoneyPage } from "./pages/MoneyPage/MoneyPage";
import { AccountPage } from "./pages/AccountsPage/AccountsPage";
import { CreateAccountPage } from "./pages/CreateAccountPage/CreateAccountPage";
import { AccountTransferPage } from "./pages/AccountTransferPage/AccountTransferPage";
import { AccountDetailPage } from "./pages/AccountDetailPage/AccountDetailPage";

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return (
      <>
        <Routes>
          <Route path="/" element={<HomePage />} /> 
          <Route path="/money" element={<MoneyPage />} />
          <Route path="/accounts" element={<AccountPage />} />
          <Route path="/accounts/detail/:accountId" element={<AccountDetailPage  />} />
          <Route path="/accounts/create" element={<CreateAccountPage />} />
          <Route path="/accounts/transfer" element={<AccountTransferPage />} />
        </Routes>
      </>
    );
  }

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

export function App() {
  return (
    <AuthProvider>
      <ScrollProvider>
        <Router>
          <AppRoutes />
        </Router>
      </ScrollProvider>
    </AuthProvider>
  );
}
