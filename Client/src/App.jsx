import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/auth/Signup";
import BusinessDashboard from "./pages/BusinessDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import PrivateRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
      {/* PUBLIC */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/auth/Signup" element={<Signup />} />

      {/* USER Private */}
        <Route
          path="/home"
          element={
            <PrivateRoute allowed={["user"]}>
              <Home />
            </PrivateRoute>
          }
        />

        {/* BUSINESS Private */}
        <Route
          path="/business-dashboard"
          element={
            <PrivateRoute allowed={["business"]}>
              <BusinessDashboard />
            </PrivateRoute>
          }
        />

        {/* ADMIN Private */}
        <Route
          path="/admin"
          element={
            <PrivateRoute allowed={["admin"]}>
              <AdminDashboard />
            </PrivateRoute>
          }
        />

        <Route path="/forgot-password" element={<ForgotPassword />} />

        <Route path="/reset-password" element={<ResetPassword />} />

      </Routes>

      <Footer />
    </>
  );
}
