// Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Navbar() {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  // Load user role from sessionStorage on mount
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setRole(parsedUser.role);
    }
  }, []);


  return (
    <nav style={{ padding: "20px", background: "#ddd" }}>
      <Link to="/">Home</Link> |{" "}

      {/* Show login only if no user */}
      {!role && <Link to="/login">Login</Link>}

      {/* Show dashboards based on role */}
      {role === "business" && (
        <>
          <Link to="/business-dashboard">Business Dashboard</Link> |{" "}
        </>
      )}

      {role === "admin" && (
        <>
          <Link to="/admin">Admin Dashboard</Link> |{" "}
        </>
      )}

      {/* Logout button if logged in */}
      {role && <button onClick={() => navigate("/logout")} style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >Logout</button>}
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
