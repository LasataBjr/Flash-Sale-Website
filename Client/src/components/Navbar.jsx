import { Link } from "react-router-dom";

export default function Navbar() {
  const role = localStorage.getItem("role"); // "admin" | "business" | null

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <nav style={{ padding: "20px", background: "#ddd" }}>
      <Link to="/">Home</Link> |

      {!role && <Link to="/login"> Login </Link>}

      {role === "business" && (
        <Link to="/business"> Business Dashboard </Link>
      )}

      {role === "admin" && (
        <Link to="/admin"> Admin Dashboard </Link>
      )}
      {/* else navigate("/"); */}
      {role && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}
