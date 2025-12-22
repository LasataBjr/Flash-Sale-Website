import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Signup = () => {
  const navigate = useNavigate();
  const [role, setRole] = useState("user"); 
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
    businessName: "",
    ownerName: "",
    phone: "",
    businessType: "",
    address: "",
    businessDetail: "",
    websiteURL: "",
    facebookURL: "",
    instagramURL: "",
  });

  const [verificationDocument, setVerificationDocument] = useState(null);
  const [message, setMessage] = useState("");

  const backendURL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFile = (e) => {
    setVerificationDocument(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      return setMessage("Email & password required.");
    }

    const data = new FormData();
    data.append("role", role);
    data.append("email", form.email);
    data.append("password", form.password);

    if (role === "user") {
      data.append("fullName", form.fullName);
    }

    if (role === "business") {
      data.append("businessName", form.businessName);
      data.append("ownerName", form.ownerName);
      data.append("phone", form.phone);
      data.append("businessType", form.businessType);
      data.append("address", form.address);
      data.append("businessDetail", form.businessDetail);
      data.append("websiteURL", form.websiteURL);
      data.append("facebookURL", form.facebookURL);
      data.append("instagramURL", form.instagramURL);

      if (!verificationDocument) {
        return setMessage("Verification document is required.");
      }
      data.append("verificationDocument", verificationDocument);
    }

    try {
      const res = await axios.post(`${backendURL}/users/register`, data);
      setMessage(res.data.message);

      // Navigate to login after success
      setTimeout(() => navigate("/login"), 1500);

    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Error occurred");
    }
  };

  return (
    <div className="signup-container" style={{ width: "450px", margin: "auto" }}>
      <h2>Create Account</h2>

      <div>
        <label>Select Role:</label>
        <select value={role} onChange={(e) => setRole(e.target.value)}>
          <option value="user">User</option>
          <option value="business">Business</option>
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        {role === "user" && (
          <>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              value={form.fullName}
              onChange={handleChange}
              required
            />
          </>
        )}

        {role === "business" && (
          <>
            <input
              type="text"
              name="businessName"
              placeholder="Business Name"
              value={form.businessName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="ownerName"
              placeholder="Owner Name"
              value={form.ownerName}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="phone"
              placeholder="Phone"
              value={form.phone}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="businessType"
              placeholder="Business Type"
              value={form.businessType}
              onChange={handleChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Address"
              value={form.address}
              onChange={handleChange}
              required
            />

            <textarea
              name="businessDetail"
              placeholder="Business Detail"
              value={form.businessDetail}
              onChange={handleChange}
            />

            <input
              type="text"
              name="websiteURL"
              placeholder="Website URL"
              value={form.websiteURL}
              onChange={handleChange}
            />

            <input
              type="text"
              name="facebookURL"
              placeholder="Facebook URL"
              value={form.facebookURL}
              onChange={handleChange}
            />

            <input
              type="text"
              name="instagramURL"
              placeholder="Instagram URL"
              value={form.instagramURL}
              onChange={handleChange}
            />

            <label>Verification Document:</label>
            <input
              type="file"
              onChange={handleFile}
              accept="image/*,application/pdf"
              required
            />
          </>
        )}

        <button type="submit">Sign Up</button>
      </form>

      {message && <p>{message}</p>}

      {/* Go to Login */}
      <p style={{ marginTop: "10px" }}>
        Already have an account?{" "}
        <span
          style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/login")}
        >
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;
