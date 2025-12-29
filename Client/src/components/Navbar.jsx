import { Link, useNavigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  // Always sync user from storage
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    setUser(storedUser ? JSON.parse(storedUser) : null);
  }, [location.pathname]); // 🔥 re-run on route change

  const handleLogout = () => {
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <nav style={{ padding: "20px", background: "#ddd" }}>
      <Link to="/">Home</Link> |{" "}

      {/* Show Login ONLY when not logged in */}
      {!user && <Link to="/login">Login</Link>}

      {/* Business dashboard */}
      {user?.role === "business" && (
        <>
          <Link to="/business-dashboard">Business Dashboard</Link> |{" "}
        </>
      )}

      {/* Admin dashboard */}
      {user?.role === "admin" && (
        <>
          <Link to="/admin">Admin Dashboard</Link> |{" "}
        </>
      )}

      {/* Logout */}
      {user && (
        <button
          onClick={handleLogout}
          style={{
            marginLeft: "10px",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      )}
    </nav>
  );
}



// import { Link } from "react-router-dom";

// export default function Navbar() {
//   const role = localStorage.getItem("role"); // "admin" | "business" | null

//   const handleLogout = () => {
//     localStorage.removeItem("role");
//     localStorage.removeItem("token");
//     window.location.href = "/login";
//   };

//   return (
//     <nav style={{ padding: "20px", background: "#ddd" }}>
//       <Link to="/">Home</Link> |

//       {!role && <Link to="/login"> Login </Link>}

//       {role === "business" && (
//         <Link to="/business-dashboard"> Business Dashboard </Link>
//       )}

//       {role === "admin" && (
//         <Link to="/admin"> Admin Dashboard </Link>
//       )}
//       {/* else navigate("/"); */}
//       {role && (
//         <button onClick={handleLogout}>Logout</button>
//       )}
//     </nav>
//   );
// }
