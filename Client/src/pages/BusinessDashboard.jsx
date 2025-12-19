import React from "react";

export default function BusinessDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "40px" }}>
      <h1>Business Dashboard</h1>
      <h3>Welcome, {user?.fullName}</h3>
      <p>Your role: {user?.role}</p>
    </div>
  );
}
