import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // 🔹 Clear session-based auth
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
  
    // 🔹 Redirect to login page
    navigate("/login", { replace: true });
  }, [navigate]);

  return null; // nothing to render
};

export default Logout;
