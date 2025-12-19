import React, { useState } from "react";
import axios from "axios";
import { API } from "../api";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${API}/request-reset`, { email });
      alert("Reset token generated!");
      setToken(res.data.token); // show token temporarily
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Forgot Password</h2>
        <button onClick={() => navigate("/forgot-password")}>
            Forgot Password?
        </button>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        /><br/><br/>

        <button type="submit">Request Reset</button>
      </form>

      {token && (
        <div style={{ marginTop: 20 }}>
          <strong>Use this token for reset:</strong>
          <p>{token}</p>
        </div>
      )}
    </div>
  );
}
