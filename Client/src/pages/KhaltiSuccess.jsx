import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function KhaltiSuccess() {
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const verifyPayment = async () => {
      try {
        await axios.post(
          `${backendURL}/wallet/khalti/verify`,
          { amount: 100 },
          { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
        );

        navigate("/business/wallet");
      } catch (err) {
        console.error("Khalti verify error:", err);
        alert("Payment verification failed");
      }
    };

    verifyPayment();
  }, []);

  return <p>Verifying payment...</p>;
}
