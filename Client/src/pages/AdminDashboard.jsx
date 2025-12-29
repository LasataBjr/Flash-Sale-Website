import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


export default function AdminDashboard() {

  const [users, setUsers] = useState([]);
  const [businesses, setBusinesses] = useState([]);

  

  const backendURL = "http://localhost:5000"; 
  const token = sessionStorage.getItem("token");

  useEffect(() => { fetchData(); }, []);

  const headers = { Authorization: `Bearer ${token}` };

  const fetchData = async () => {
    const u = await axios.get(`${backendURL}/api/admin/users`, { headers });
    const b = await axios.get(`${backendURL}/api/admin/business`, { headers });

    setUsers(u.data);
    setBusinesses(b.data);
  };

  const approveBusiness = async (id) => {
    await axios.put(`${backendURL}/api/admin/business/approve/${id}`, {}, { headers });
    fetchData();
  };

  const rejectBusiness = async (id) => {
    await axios.put(`${backendURL}/api/admin/business/reject/${id}`, {}, { headers });
    fetchData();
  };

  const makeAdmin = async (id) => {
    await axios.put(`${backendURL}/api/admin/make-admin/${id}`, {}, { headers });
    fetchData();
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>Admin Panel</h1>
      

    
      {/* Users Table */}
      <h2>Users</h2>
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>Avatar</th>
            <th>Fullname</th>
            <th>Email</th>
            <th>Role</th>
            <th>Make Admin</th>
          </tr>
        </thead>
        <tbody>
          {users.map(u => (
            <tr key={u._id}>
              <td>
                <img
                  src={u.profileImage ? `${backendURL}${u.profileImage}` : "/default-user.png"}
                  style={{ width: "50px", height: "50px", borderRadius: "50%" }}
                  alt=""  />
                
              </td>
              <td>{u.fullName}</td>
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


      {/* Business Table */}
      <h2 style={{ marginTop: "40px" }}>Business Accounts</h2>

<table border="1" cellPadding="8" width="100%">
  <thead>
    <tr>
      <th>Logo</th>
      <th>Business Name</th>
      <th>Email</th>
      <th>Status</th>
      <th>Total Products</th>
      <th>Total Clicks</th>
      <th>Total Clients</th>
      <th>Total Balance (Rs.)</th>
      <th>Document</th>
      <th>Actions</th>
    </tr>
  </thead>

  <tbody>
    {businesses.map((b) => (
      <tr key={b._id}>
        <td>
          <img
            src={b.businessLogo ? `${backendURL}${b.businessLogo}` : "/default-business.png"}
            style={{ width: "60px", height: "60px", borderRadius: "8px" }}
            alt=""
          />
        </td>
        <td>{b.businessName}</td>
        <td>{b.email}</td>
        <td>{b.status}</td>

        <td>{b.totalProducts ?? 0}</td>
        <td>{b.totalClicks ?? 0}</td>
        <td>{b.totalClients ?? 0}</td>
        <td>Rs. {b.totalBalance ?? 0}</td>

        <td>
          {b.verificationDocument ? (
            <button
              onClick={() =>
                window.open(`${backendURL}${b.verificationDocument}`, "_blank")
              }
            >
              View
            </button>
          ) : (
            "No File"
          )}
        </td>

        <td>
          {b.status === "pending" ? (
            <>
              <button onClick={() => approveBusiness(b._id)}>Approve</button>
              <button onClick={() => rejectBusiness(b._id)}>Reject</button>
            </>
          ) : (
            "Verified"
          )}
        </td>
      </tr>
    ))}
  </tbody>
</table>


    </div>
  );
}
