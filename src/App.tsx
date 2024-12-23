import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/home-page/HomePage";
import FriendsPage from "./pages/friends-page/FriendsPage";
import LoginPage from "./pages/login-page/LoginPage";
import styles from "./App.module.css";
import AuthGuard from "./auth/AuthGuard";

export function App() {
  return (
    <Router>
      <header>
        <nav>
          <div className={styles["title"]}>Nemesis</div>
        </nav>
      </header>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route element={<AuthGuard />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/friends" element={<FriendsPage />} />
        </Route>
      </Routes>
    </Router>
  );
}
