import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowed }) {
  // Try to get token and user from localStorage first, fallback to sessionStorage
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  const userData = localStorage.getItem("user") || sessionStorage.getItem("user");
  const user = userData ? JSON.parse(userData) : null;

  // Not logged in or no user data
  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  // Role not allowed
  if (allowed && !allowed.includes(user.role)) {
    return <Navigate to="/" replace />;
  }

  // User is authorized
  return children;
}
