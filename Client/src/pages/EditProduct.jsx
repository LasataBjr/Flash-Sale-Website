import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import categoryMap from "../config/categoryMap";

export default function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const backendURL = import.meta.env.VITE_API_URL;

  const dealTypes = [
    "Flash Deal",
    "Discount Offer",
    "Limited Time Offer",
    "Buy One Get One",
    "Seasonal Offer",
  ];

  const [form, setForm] = useState({
    title: "",
    description: "",
    price: "",
    discount: "",
    stockQuantity: "",
    category: "",
    subCategory: "",
    dealType: "",
    redirectUrl: "",
    expiryDate: "",
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch single product
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await axios.get(`${backendURL}/products/${id}`, {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        });
        const data = res.data.product;
        setForm({
          title: data.title || "",
          description: data.description || "",
          price: data.price || "",
          discount: data.discount || "",
          stockQuantity: data.stockQuantity || "",
          category: data.category || "",
          subCategory: data.subCategory || "",
          dealType: data.dealType || "",
          redirectUrl: data.redirectUrl || "",
          expiryDate: data.expiryDate?.split("T")[0] || "",
        });
        setExistingImages(data.images || []);
      } catch (err) {
        console.error(err);
        alert("Failed to fetch product");
      }
    };
    fetchProduct();
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });
  const handleCategoryChange = (e) => setForm({ ...form, category: e.target.value, subCategory: "" });
  const handleNewImages = (e) => setNewImages([...newImages, ...e.target.files]);

  const removeExistingImage = (index) =>
    setExistingImages(existingImages.filter((_, i) => i !== index));
  const removeNewImage = (index) =>
    setNewImages(newImages.filter((_, i) => i !== index));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Append form fields
      Object.entries(form).forEach(([k, v]) => {
        if (v !== "") formData.append(k, v);
      });

      // Append new images
      newImages.forEach((img) => formData.append("productImages", img));

      // Send remaining existing images to backend
      formData.append("existingImages", JSON.stringify(existingImages));

      const config = { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } };

      const res = await axios.put(`${backendURL}/products/${id}`, formData, config);

      if (res.data?.success) navigate("/business/products");
      else alert(res.data?.message || "Failed to save changes");
    } catch (err) {
      console.error(err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Edit Product</h2>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="title" value={form.title} onChange={handleChange} required />
        <textarea name="description" value={form.description} onChange={handleChange} required />
        <input type="number" name="price" value={form.price} onChange={handleChange} required />
        <input type="number" name="discount" value={form.discount} onChange={handleChange} />
        <input type="number" name="stockQuantity" value={form.stockQuantity} onChange={handleChange} required />

        <select name="category" value={form.category} onChange={handleCategoryChange} required>
          <option value="">Select Category</option>
          {Object.keys(categoryMap).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {form.category && (
          <select name="subCategory" value={form.subCategory} onChange={handleChange} required>
            <option value="">Select Subcategory</option>
            {categoryMap[form.category].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}

        <select name="dealType" value={form.dealType} onChange={handleChange} required>
          <option value="">Select Deal</option>
          {dealTypes.map((d) => (<option key={d} value={d}>{d}</option>))}
        </select>

        <input type="url" name="redirectUrl" value={form.redirectUrl} onChange={handleChange} required />
        <input type="date" name="expiryDate" value={form.expiryDate} onChange={handleChange} required />

        {/* Existing images */}
        {existingImages.length > 0 && (
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            {existingImages.map((img, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={`${backendURL.replace("/api", "")}${img}`} style={{ width: 80, height: 80, objectFit: "cover" }} />
                <button type="button" onClick={() => removeExistingImage(i)} style={{ position: "absolute", top: 0, right: 0 }}>X</button>
              </div>
            ))}
          </div>
        )}

        {/* New images */}
        {newImages.length > 0 && (
          <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
            {newImages.map((img, i) => (
              <div key={i} style={{ position: "relative" }}>
                <img src={URL.createObjectURL(img)} style={{ width: 80, height: 80, objectFit: "cover" }} />
                <button type="button" onClick={() => removeNewImage(i)} style={{ position: "absolute", top: 0, right: 0 }}>X</button>
              </div>
            ))}
          </div>
        )}

        <input type="file" multiple onChange={handleNewImages} />

        <button type="submit" disabled={loading}>{loading ? "Saving..." : "Save Changes"}</button>
      </form>
    </div>
  );
}
