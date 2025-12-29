import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function BusinessDashboard() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const backendURL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

  // Fetch user data from sessionStorage or backend
  const fetchUserData = async () => {
    const storedUser = sessionStorage.getItem("user");
    if (!storedUser) {
      navigate("/login");
      return;
    }
    const token = sessionStorage.getItem("token");
    const parsedUser = JSON.parse(storedUser);
    try {
      // Fetch latest user data from backend
      const res = await axios.get(`${backendURL}/business/${parsedUser._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
      sessionStorage.setItem("user", JSON.stringify(res.data.user)); // update sessionStorage
    } catch (err) {
      console.error(err);
      setMessage("Failed to fetch latest data. Please login again.");
      sessionStorage.removeItem("user");
      sessionStorage.removeItem("token");
      navigate("/login");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  // const handleLogout = () => {
  //   sessionStorage.removeItem("user");
  //   sessionStorage.removeItem("token");
  //   navigate("/login");
  // };

  if (loading) return <p style={{ padding: "40px" }}>Loading...</p>;
  if (!user)
    return (
      <div style={{ padding: "40px" }}>
        <h1>No user data found ❌</h1>
        <p>Please login first.</p>
      </div>
    );

  return (
    <div style={{ padding: "40px" }}>
      <h1>Business Dashboard</h1>
      <h3>Welcome, {user.businessName || user.email}</h3>
      <p><strong>Role:</strong> {user.role}</p>
      <p><strong>Status:</strong> {user.status}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <p><strong>Owner Name:</strong> {user.ownerName}</p>
      <p><strong>Phone:</strong> {user.phone}</p>
      <p><strong>Business Type:</strong> {user.businessType}</p>
      <p><strong>Address:</strong> {user.address}</p>
      <p><strong>Wallet Balance:</strong> ${user.walletBalance ?? 0}</p>
      <p><strong>Total Products:</strong> {user.totalProducts ?? 0}</p>
      <p><strong>Total Clicks:</strong> {user.totalClicks ?? 0}</p>
      <p><strong>Total Clients:</strong> {user.purchasedClients ?? 0}</p>

      {/* <button
        onClick={handleLogout}
        style={{ marginTop: "20px", padding: "10px 20px", cursor: "pointer" }}
      >
        Logout
      </button> */}
      

      <button onClick={() => navigate("/business/products/new")}>
        ➕ Post a Deal
      </button>
      <button onClick={() => navigate("/business/wallet")}>
        💰 Wallet Balance: ${user.walletBalance}
      </button>
      <button onClick={() => navigate("/business/products")}>
        All Products
      </button>

      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
}
