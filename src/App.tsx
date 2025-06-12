import {
  BrowserRouter as Router,
  Routes,
  Route,
} from "react-router-dom";
import HomePage from "./pages/home-page/HomePage";
import FriendsPage from "./pages/friends-page/FriendsPage";
import LoginPage from "./pages/login-page/LoginPage";
import AuthGuard from "./auth/AuthGuard";
import SendMoneyPage from "./pages/send-money-page/SendMoneyPage";
import Navbar from "./components/navbar/Navbar";

export function App() {
  return (
    <Router>
      <header>
        <Navbar />
      </header>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
          <Route path="/send-money/:userId" element={<SendMoneyPage />} />
        </Route>
      </Routes>
    </Router>
  );
}