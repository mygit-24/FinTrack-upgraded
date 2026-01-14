import './i18n'; 
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "context/AuthContext";
import PrivateRoute from "components/PrivateRoute";
import { useTranslation } from "react-i18next";
import { useEffect } from 'react';

import Layout from "components/layout/Layout";
import HomePage from "./pages/HomePage";
import Transactions from "./pages/Transactions/TransactionsPage";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import './styles/global.scss'
import Goals from "pages/Goals";


export default function App() {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === "he" ? "rtl" : "ltr";
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === "he" ? "en" : "he";
    i18n.changeLanguage(newLang);
    document.documentElement.dir = newLang === "he" ? "rtl" : "ltr"; 
  };

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<HomePage />} />
            <Route element={<PrivateRoute />}>
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/goals" element={<Goals />} />
            </Route>
          </Route>

          {/* דפים ללא Layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}


