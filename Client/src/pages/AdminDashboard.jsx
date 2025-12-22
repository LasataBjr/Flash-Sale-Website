import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminDashboard() {
  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  const backendURL = "http://localhost:5000"; // or import.meta.env.VITE_API_URL
  const token = localStorage.getItem("token");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const headers = { Authorization: `Bearer ${token}` };

    const u = await axios.get(`${backendURL}/api/admin/users`, { headers });
    const b = await axios.get(`${backendURL}/api/admin/business`, { headers });

    setUsers(u.data);
    setBusinesses(b.data);
  };

  const approveBusiness = async (id) => {
    const headers = { Authorization: `Bearer ${token}` };

    await axios.put(`${backendURL}/api/admin/business/approve/${id}`, {}, { headers });
    fetchData();
  };

  const rejectBusiness = async (id) => {
    const headers = { Authorization: `Bearer ${token}` };

    await axios.put(`${backendURL}/api/admin/business/reject/${id}`, {}, { headers });
    fetchData();
  };

  const makeAdmin = async (id) => {
    const headers = { Authorization: `Bearer ${token}` };

    await axios.put(`${backendURL}/api/admin/make-admin/${id}`, {}, { headers });
    fetchData();
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>

      <h2>Users</h2>
      <table>
        <thead>
          <tr><th>Email</th><th>Role</th><th>Action</th></tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>{u.email}</td>
              <td>{u.role}</td>
              <td>
                {u.role !== "admin" && (
                  <button onClick={() => makeAdmin(u._id)}>Make Admin</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2>Business Accounts</h2>
      <table>
        <thead>
          <tr><th>Email</th><th>Status</th><th>Action</th></tr>
        </thead>
        <tbody>
          {businesses.map(b => (
            <tr key={b._id}>
              <td>{b.email}</td>
              <td>{b.status}</td>
              <td>
                {b.status === "pending" && (
                  <>
                    <button onClick={() => approveBusiness(b._id)}>Approve</button>
                    <button onClick={() => rejectBusiness(b._id)}>Reject</button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
