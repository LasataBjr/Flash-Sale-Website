import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Wallet() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_API_URL;

  const [wallet, setWallet] = useState({
    business: null,
    closingBalance: 0,
    transactions: [],
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWallet = async () => {
      try {
        const res = await axios.get(`${backendURL}/wallet/statement`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        if (res.data.success) {
          setWallet({
            business: res.data.business,
            closingBalance: res.data.closingBalance,
            transactions: res.data.transactions || [],
          });
        }
      } catch (err) {
        console.error("Wallet fetch error:", err);
        alert("Failed to fetch wallet");
      } finally {
        setLoading(false);
      }
    };

    fetchWallet();
  }, []);

  if (loading) return <p>Loading wallet...</p>;

  return (
    <div className="container mt-4">
      {/* BUSINESS HEADER */}
      <div style={{ display: "flex", gap: 20, alignItems: "center" }}>
        {wallet.business?.businessLogo && (
          <img
            src={`${backendURL.replace("/api", "")}${wallet.business.businessLogo}`}
            alt="Business Logo"
            style={{
              width: 80,
              height: 80,
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        )}

        <div>
          <h3>{wallet.business?.businessName}</h3>
          <p>Owner: {wallet.business?.ownerName}</p>
        </div>
      </div>

      <hr />

      {/* BALANCE */}
      <h4>Current Balance: ${wallet.closingBalance}</h4>

      <button
        onClick={() => navigate("/business/wallet/topup")}
        style={{ marginBottom: 20 }}
      >
        ➕ Top Up Wallet
      </button>

      {/* STATEMENT */}
      {wallet.transactions.length === 0 ? (
        <p>No transactions yet.</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" width="100%">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Amount</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            {wallet.transactions.map((t) => (
              <tr key={t._id}>
                <td>{new Date(t.createdAt).toLocaleString()}</td>
                <td>{t.type}</td>
                <td style={{ color: t.type === "debit" ? "red" : "green" }}>
                  {t.type === "debit" ? "-" : "+"}${t.amount}
                </td>
                <td>{t.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
