export default function BusinessDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("LOCAL USER:", localStorage.getItem("user"));
  return (
    <div style={{ padding: "40px" }}>
      <h1>Business Dashboard</h1>
      <h3>Welcome, {user?.email}</h3>
      <p>Your role: {user?.role}</p>
      <p>Status: {user?.status}</p>
    </div>
    

  );
}