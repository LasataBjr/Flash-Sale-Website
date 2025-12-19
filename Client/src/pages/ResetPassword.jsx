import React, { useState } from "react";
import axios from "axios";
import { API } from "../api";
import { useSearchParams } from "react-router-dom";

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [query] = useSearchParams();
  const token = query.get("token"); // only source of token

  const handleReset = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${API}/reset-password`, {
        token,
        password,
      });
      alert("Password reset successful!");
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

        <button type="submit">Change Password</button>
      </form>
    </div>
  );
}
