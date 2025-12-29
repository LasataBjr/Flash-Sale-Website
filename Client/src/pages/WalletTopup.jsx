import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function WalletTopup() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_API_URL;

  const handleKhalti = async () => {
    try {
      const res = await axios.post(
        `${backendURL}/wallet/khalti/initiate`,
        { amount: 100 },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      if (res.data.success) {
        window.location.href = res.data.payment_url;
      }
    } catch (err) {
      console.error("Khalti initiate error:", err);
      alert("Failed to initiate Khalti payment");
    }
  };

  return <button onClick={handleKhalti}>Top-up with Khalti</button>;
}
