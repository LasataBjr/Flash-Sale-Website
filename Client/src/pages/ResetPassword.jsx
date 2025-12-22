import React, { useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [query] = useSearchParams();
  const token = query.get("token"); // only source of token
  const backendURL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();


  const handleReset = async (e) => {
    e.preventDefault();

    // 1. token validation
    if (!token) {
      alert("Token missing in URL. Request a new reset link.");
      return;
    }

    // 2. password match validation
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await axios.post(`${backendURL}/users/reset-password`, {
        token,
        password,
      });
      alert("Password reset successful!"); 
      navigate("/login");
    } catch (err) {
      alert(err.response?.data?.message || "Error");
    }
  };

  return (
    <div style={{ padding: 40 }}>
      <h2>Reset Password</h2>

      <form onSubmit={handleReset}>
        <input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        /><br /><br />

        <input
          type="password"
          placeholder="Confirm new password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
        /><br /><br />

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}
