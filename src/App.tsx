import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthGuard from "./auth/AuthGuard";
import HomePage from './pages/home-page/HomePage';


export function App() {
  return (
    <Router>
      <Routes>
        {/* <Route element={<AuthGuard />}> */}
          <Route path="/" element={<HomePage />} />          
        {/* </Route> */}
      </Routes>
    </Router>
  );
}