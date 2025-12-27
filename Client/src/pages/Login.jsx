import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
      });

      // block pending or rejected accounts
      if (res.data.user.status === "pending") {
        setMessage("Your account is pending approval ❌");
        setLoading(false);
        return;
      }
      if (res.data.user.status === "rejected") {
        setMessage("Your account was rejected ❌");
        setLoading(false);
        return;
      }

      // Save to sessionStorage
      sessionStorage.setItem("token", res.data.token);
      sessionStorage.setItem("user", JSON.stringify(res.data.user));
      // NOTE: The original code sets 'user' in the dashboard but not here.
      // If 'user' is needed in other components, you should save res.data.user here as well.
      // sessionStorage.setItem("user", JSON.stringify(res.data.user)); 

      const role = res.data.user.role;
      setMessage("Login successful ✔");
      console.log("Logged in user role:", role);

      // Redirect by role
      if (role === "admin") navigate("/admin");
      else if (role === "business") navigate("/business-dashboard");
      else navigate("/home");
    } catch (err) {
      setMessage(err.response?.data?.message || "Login failed ❌");
    }
    setLoading(false);
  };

  return (
    <div style={{ width: "400px", margin: "auto", paddingTop: "50px" }}>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          style={{ width: "100%", padding: "8px" }}
        />
        <br />
        <br />
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          style={{ width: "100%", padding: "8px" }}
        />
        <br />
        <br />
        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
        <p style={{ marginTop: "10px" }}>
          Forgot Password?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/forgot-password")}
          >
            Reset Here
          </span>
        </p>
        <p style={{ marginTop: "10px" }}>
          Don't have an account?{" "}
          <span
            style={{ color: "blue", cursor: "pointer" }}
            onClick={() => navigate("/auth/Signup")}
          >
            Sign up
          </span>
        </p>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
}