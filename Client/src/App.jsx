import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import TestLoginAPI from "./pages/TestLoginAPI";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/auth/Signup";
import BusinessDashboard from "./pages/BusinessDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Routes, Route } from "react-router-dom";


export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />        
        <Route path="/test-login" element={<TestLoginAPI />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/Signup" element={<Signup />} />

        {/* USER PRIVATE */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowed={["user"]}>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* BUSINESS PRIVATE */}
        <Route
          path="/business-dashboard"
          element={
            <ProtectedRoute allowed={["business"]}>
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />

        {/* ADMIN PRIVATE */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowed={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* AUTH ROUTES */}
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

      </Routes>
      <Footer />
    </>
  );
}
