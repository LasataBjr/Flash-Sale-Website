import React from "react";

export default function AdminDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div style={{ padding: "40px" }}>
      <h1>Admin Dashboard</h1>
      <h3>Hello, {user?.name}</h3>
      <p>You have full permissions</p>
    </div>
  );
}
