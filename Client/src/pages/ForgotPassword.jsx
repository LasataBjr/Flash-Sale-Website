import React, { useState } from "react";
import axios from "axios";

const backendURL = import.meta.env.VITE_API_URL;

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await axios.post(`${backendURL}/auth/request-reset`, { email });
      setSent(true);
    } catch (err) {
      setError(err.response?.data?.message || "Error requesting reset");
    } finally {
      setLoading(false);
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
        />
        <br /><br />

        <button type="submit" disabled={loading}>
          {loading ? "Sending..." : sent ? "Resend Reset Link" : "Send Reset Link"}
        </button>
      </form>

      {sent && (
        <p style={{ color: "green", marginTop: 15 }}>
          Reset link sent to your email.
        </p>
      )}

      {error && (
        <p style={{ color: "red", marginTop: 15 }}>{error}</p>
      )}
    </div>
  );
}
