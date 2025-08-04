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
import { HomePage } from "./pages/HomePage/HomePage";
import { MoneyPage } from "./pages/MoneyPage/MoneyPage";
import { AccountPage } from "./pages/AccountPage/AccountPage";
import { CreateAccountPage } from "./pages/CreateAccountPage/CreateAccountPage";

function AppRoutes() {
  const { isAuthenticated } = useAuth();
  
  if (isAuthenticated) {
    return (
      <>
        <Routes>
        {/* <header>
        <Navbar />
      </header> */}
          {/* <Route path="/" element={<HomePage />} /> */}
          <Route path="/" element={<HomePage />} /> 
          {/* <Route path="/friends" element={<FriendsPage />} /> */}
          <Route path="/money" element={<MoneyPage />} />
          <Route path="/accounts" element={<AccountPage />} />
          <Route path="/accounts/create" element={<CreateAccountPage />} />
        </Routes>
      </>
    );
  }

  return (
    <Routes>
      {/* <header>
        <Navbar />
      </header> */}
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
    <AuthProvider >
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
}
