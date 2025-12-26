import { useEffect } from "react";
import axios from "axios";

export default function TestLoginAPI() {
  useEffect(() => {
    const testLogin = async () => {
      try {
        const res = await axios.post("http://localhost:5000/api/users/login", {
          email: "your_test_email@example.com", // replace with your test email
          password: "your_test_password",       // replace with your test password
        });
        console.log("✅ API Response:", res.data);
      } catch (err) {
        console.error("❌ API Error:", err.response?.data || err.message);
      }
    };

    testLogin();
  }, []);

  return <div>Check console for API test results</div>;
}
