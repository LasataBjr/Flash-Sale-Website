import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

export default function AddProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  const backendURL = import.meta.env.VITE_API_URL;

  // ENUMS MUST MATCH BACKEND
  const categories = [
    "Food & Beverage",
    "Electronics",
    "Fashion",
    "Travel",
    "Health & Beauty",
    "Education",
    "Automobile",
    "Real Estate",
    "Home & Living",
    "Entertainment",
    "Services",
    "Others",
  ];

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
    dealType: "",
    redirectUrl: "",
    expiryDate: "",
  });

  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);

  // LOAD PRODUCT FOR EDIT
  useEffect(() => {
    if (isEdit) fetchProduct();
  }, [id]);

  const fetchProduct = async () => {
    try {
      const res = await axios.get(`${backendURL}/products/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      setForm({
        ...res.data.data,
        expiryDate: res.data.data.expiryDate?.split("T")[0] || "",
      });
    } catch (err) {
      console.error("FETCH PRODUCT ERROR:", err);
    }
  };

  // INPUT HANDLER
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      Object.entries(form).forEach(([key, value]) => {
        if (value !== "") formData.append(key, value);
      });

      images.forEach((img) => formData.append("productImages", img));

      const config = {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      };

      let res;
      if (isEdit) {
        res = await axios.put(`${backendURL}/products/${id}`, formData, config);
      } else {
        res = await axios.post(`${backendURL}/products`, formData, config);
      }

      if (res.data?.success) {
        navigate("/business/products");
      } else {
        alert(res.data?.message || "Product save failed");
      }
    } catch (err) {
      console.error("PRODUCT SAVE ERROR:", err.response?.data || err);
      alert(err.response?.data?.message || "Failed to save product");
    } finally {
      setLoading(false);
    }
  };

  // UI
  return (
    <div className="container mt-4">
      <h2>{isEdit ? "Edit Product" : "Add Product Deal"}</h2>

      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input
          name="title"
          placeholder="Product Title"
          value={form.title}
          onChange={handleChange}
          required
        />

        <textarea
          name="description"
          placeholder="Product Description"
          value={form.description}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
        />

        <input
          type="number"
          name="discount"
          placeholder="Discount (%)"
          value={form.discount}
          onChange={handleChange}
        />

        <input
          type="number"
          name="stockQuantity"
          placeholder="Stock Quantity"
          value={form.stockQuantity}
          onChange={handleChange}
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
        >
          <option value="">Select Category</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          name="dealType"
          value={form.dealType}
          onChange={handleChange}
          required
        >
          <option value="">Select Deal Type</option>
          {dealTypes.map((deal) => (
            <option key={deal} value={deal}>
              {deal}
            </option>
          ))}
        </select>

        <input
          type="url"
          name="redirectUrl"
          placeholder="Vendor Website Link"
          value={form.redirectUrl}
          onChange={handleChange}
          required
        />

        <input
          type="date"
          name="expiryDate"
          value={form.expiryDate}
          onChange={handleChange}
          required
        />

        <input type="file" multiple onChange={handleImageChange} />

        <button type="submit" disabled={loading}>
          {loading ? "Saving..." : "Save Product"}
        </button>
      </form>
    </div>
  );
}
