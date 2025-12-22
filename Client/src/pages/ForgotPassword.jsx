import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// Backend base URL
const backendURL = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${backendURL}/users/request-reset`, { email });
      alert("Reset token generated!");
      setToken(res.data.token); // show token temporarily
    } catch (err) {
      alert(err.response?.data?.message || "Error requesting reset");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Forgot Password</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/><br/>

        <button type="submit">Request Reset</button>
      </form>

      {/* Show token for manual testing */}
      {token && (
        <div style={{ marginTop: 20 }}>
          <strong>Use this token for reset:</strong>
          <p>{token}</p>

          <button
            onClick={() => navigate(`/reset-password?token=${token}`)}
            style={{ marginTop: 10 }}
          >
            Reset Password Now
          </button>
        </div>
      )}
    </div>
  );
}
