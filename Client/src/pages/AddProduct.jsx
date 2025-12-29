import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function AddProduct() {
  const navigate = useNavigate();
  const API = import.meta.env.VITE_API_URL;

  const categories = {
    "Fashion & Lifestyle": ["Men", "Women", "Kids"],
    "Cosmetic/Beauty": ["Skincare", "Makeup", "Haircare"],
    "Electronics & Gadgets": ["Mobile", "Laptop", "Accessories"],
    "Sports & Fitness": ["Gym Equipment", "Sportswear"],
    "Automotive & Accessories": ["Car", "Motorbike", "Spare Parts"],
    "Home Appliances": ["Kitchen", "Laundry", "Cooling/Heating"],
    "Grocery": ["Vegetables", "Fruits", "Packaged Goods"],
    "Stationery": ["Books", "Writing Tools", "Office Supplies"],
    "Household & Living": ["Furniture", "Decor", "Bedding"],
    "Health & Wellness": ["Supplements", "Medical", "Fitness Gear"],
    "Accommodation": ["Hotels", "Hostels", "Rentals"],
    "Entertainment Hub": ["Movies", "Games", "Events"],
  };

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

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleCategoryChange = (e) =>
    setForm({ ...form, category: e.target.value, subCategory: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([k, v]) => formData.append(k, v));
      images.forEach((img) => {
        formData.append("productImages", img); 
      });


      await axios.post(`${API}/products`, formData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      navigate("/business/products");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Add Product Deal</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input name="title" placeholder="Title" onChange={handleChange} required />
        <textarea name="description" placeholder="Description" onChange={handleChange} required />
        <input type="number" name="price" placeholder="Price" onChange={handleChange} required />
        <input type="number" name="discount" placeholder="Discount %" onChange={handleChange} />
        <input type="number" name="stockQuantity" placeholder="Stock" onChange={handleChange} required />

        <select name="category" onChange={handleCategoryChange} required>
          <option value="">Select Category</option>
          {Object.keys(categories).map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        {form.category && (
          <select name="subCategory" onChange={handleChange} required>
            <option value="">Select Subcategory</option>
            {categories[form.category].map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        )}

        <select name="dealType" onChange={handleChange} required>
          <option value="">Select Deal</option>
          {dealTypes.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>

        <input type="url" name="redirectUrl" placeholder="Vendor Website" onChange={handleChange} required />
        <input type="date" name="expiryDate" onChange={handleChange} required />

        <input type="file" multiple onChange={(e) => setImages([...e.target.files])} />
        {/* IMAGE PREVIEW */}
        <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
          {images.map((img, i) => (
            <img
              key={i}
              src={URL.createObjectURL(img)}
              alt="preview"
              style={{ width: 80, height: 80, objectFit: "cover" }}
            />
          ))}
        </div>

        <button disabled={loading}>{loading ? "Saving..." : "Post Deal"}</button>
      </form>
    </div>
  );
}
