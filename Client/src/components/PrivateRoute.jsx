import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, allowed }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // not logged in
  if (!token) {
    return <Navigate to="/login" />;
  }

  // role not allowed
  if (allowed && !allowed.includes(role)) {
    return <Navigate to="/" />;
  }

  return children;
}
