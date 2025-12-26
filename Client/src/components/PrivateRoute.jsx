import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowed }) {
  // Get token and user from localStorage
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  // Not logged in or no user data
  if (!token || !user) {
    return <Navigate to="/login" />;
  }

  // Role not allowed
  if (allowed && !allowed.includes(user.role)) {
    return <Navigate to="/" />;
  }

  // User is authorized
  return children;
}
