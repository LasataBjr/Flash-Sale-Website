import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/auth/Signup";
import BusinessDashboard from "./pages/BusinessDashboard";
import AddProduct from "./pages/AddProduct";
import ProductManagement from "./pages/ProductManagement";
import AdminDashboard from "./pages/AdminDashboard";
import ProtectedRoute from "./components/PrivateRoute";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import Logout from "./components/Logout";
import { Routes, Route } from "react-router-dom";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/auth/Signup" element={<Signup />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* USER PRIVATE ROUTES */}
        <Route
          path="/home"
          element={
            <ProtectedRoute allowed={["user"]}>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* BUSINESS PRIVATE ROUTES */}
        <Route
          path="/business-dashboard"
          element={
            <ProtectedRoute allowed={["business"]}>
              <BusinessDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/business/products"
          element={
            <ProtectedRoute allowed={["business"]}>
              <ProductManagement />
            </ProtectedRoute>
          }
        />

        <Route
          path="/business/products/new"
          element={
            <ProtectedRoute allowed={["business"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        <Route
          path="/business/products/edit/:id"
          element={
            <ProtectedRoute allowed={["business"]}>
              <AddProduct />
            </ProtectedRoute>
          }
        />

        {/* ADMIN PRIVATE ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowed={["admin"]}>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
      </Routes>
      <Footer />
    </>
  );
}
