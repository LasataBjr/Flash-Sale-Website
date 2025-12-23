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

  // File states
  const [profileImage, setProfileImage] = useState(null);
  const [businessLogo, setBusinessLogo] = useState(null);
  const [verificationDocument, setVerificationDocument] = useState(null);

  const [message, setMessage] = useState("");
  const backendURL = import.meta.env.VITE_API_URL;

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!form.email || !form.password) {
      return setMessage("Email & password required.");
    }

    const data = new FormData();
    data.append("role", role);
    data.append("email", form.email);
    data.append("password", form.password);

    // USER
    if (role === "user") {
      data.append("fullName", form.fullName);
      if (profileImage) data.append("profileImage", profileImage);
    }

    // BUSINESS
    if (role === "business") {
      const required = ["businessName", "ownerName", "phone", "businessType", "address"];
      for (const r of required) {
        if (!form[r]) return setMessage(`${r} is required`);
      }

      data.append("businessName", form.businessName);
      data.append("ownerName", form.ownerName);
      data.append("phone", form.phone);
      data.append("businessType", form.businessType);
      data.append("address", form.address);
      data.append("businessDetail", form.businessDetail);
      data.append("websiteURL", form.websiteURL);
      data.append("facebookURL", form.facebookURL);
      data.append("instagramURL", form.instagramURL);

      if (!businessLogo) return setMessage("Business logo required");
      data.append("businessLogo", businessLogo);

      if (!verificationDocument)
        return setMessage("Verification document required");
      data.append("verificationDocument", verificationDocument);
    }

    try {
      const res = await axios.post(`${backendURL}/users/register`, data);
      setMessage(res.data.message);
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      console.log(err);
      setMessage(err.response?.data?.message || "Server error");
    }
  };

  return (
    <div style={{ width: "450px", margin: "auto" }}>
      <h2>Create Account</h2>

      <label>Select Role:</label>
      <select value={role} onChange={(e) => setRole(e.target.value)}>
        <option value="user">User</option>
        <option value="business">Business</option>
      </select>

      <form onSubmit={handleSubmit}>

        {/* Basic */}
        <input type="email" name="email" placeholder="Email"
          value={form.email} onChange={handleChange} required />

        <input type="password" name="password" placeholder="Password"
          value={form.password} onChange={handleChange} required />

        {/* USER FIELDS */}
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

            <label>Profile Image (optional)</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setProfileImage(e.target.files[0])}
            />
          </>
        )}

        {/* BUSINESS FIELDS */}
        {role === "business" && (
          <>
            <input type="text" name="businessName" placeholder="Business Name"
              value={form.businessName} onChange={handleChange} required />

            <input type="text" name="ownerName" placeholder="Owner Name"
              value={form.ownerName} onChange={handleChange} required />

            <input type="text" name="phone" placeholder="Phone"
              value={form.phone} onChange={handleChange} required />

            <input type="text" name="businessType" placeholder="Business Type"
              value={form.businessType} onChange={handleChange} required />

            <input type="text" name="address" placeholder="Address"
              value={form.address} onChange={handleChange} required />

            <textarea name="businessDetail"
              placeholder="Business Description"
              value={form.businessDetail}
              onChange={handleChange}
            />

            <input type="url" name="websiteURL" placeholder="Website"
              value={form.websiteURL} onChange={handleChange} />

            <input type="url" name="facebookURL" placeholder="Facebook"
              value={form.facebookURL} onChange={handleChange} />

            <input type="url" name="instagramURL" placeholder="Instagram"
              value={form.instagramURL} onChange={handleChange} />

            <label>Business Logo</label>
            <input
              type="file"
              accept="image/png, image/jpeg"
              onChange={(e) => setBusinessLogo(e.target.files[0])}
              required
            />

            <label>Verification Document (PDF/Image)</label>
            <input
              type="file"
              accept="application/pdf, image/png, image/jpeg"
              onChange={(e) => setVerificationDocument(e.target.files[0])}
              required
            />
          </>
        )}

        <button type="submit">Sign Up</button>
      </form>

      <p>{message}</p>

      <p>
        Already have an account?{" "}
        <span style={{ color: "blue", cursor: "pointer" }}
          onClick={() => navigate("/login")}>
          Login
        </span>
      </p>
    </div>
  );
};

export default Signup;
