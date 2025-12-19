import { useState } from "react";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:5000/api/users/login", {
        email,
        password,
      });

      // Save token & user to localStorage
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      setMessage("Login Successful!");

      // Redirect based on role
      const role = res.data.user.role;
      if (role === "admin") window.location = "/admin";
      else if (role === "business") window.location = "/business";
      else window.location = "/";

    } catch (err) {
      setMessage(err.response?.data?.message || "Login Failed");
    }
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
        /><br /><br />
        
        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />

        <button type="submit">Login</button>
        <p>
            Forgot Password? <a href="/forgot-password">Click here</a>
        </p>

      </form>

      {message && <p>{message}</p>}
    </div>
  );
}
