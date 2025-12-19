import { Link } from "react-router-dom";

export default function Navbar() {
  const user = JSON.parse(localStorage.getItem("user")); // <-- FIX

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.location = "/login";
  };

  return (
    <nav style={{ padding: "20px", background: "#ddd" }}>
      <Link to="/">Home</Link> |

      {!user && <Link to="/login"> Login </Link>}

      {user?.role === "business" && (
        <Link to="/business"> Business Dashboard </Link>
      )}

      {user?.role === "admin" && (
        <Link to="/admin"> Admin Dashboard </Link>
      )}

      {user && (
        <button onClick={handleLogout}>Logout</button>
      )}
    </nav>
  );
}
