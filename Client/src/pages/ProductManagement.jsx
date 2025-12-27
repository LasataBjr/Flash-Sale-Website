import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState("");

  const backendURL = import.meta.env.VITE_API_URL;

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

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${backendURL}/products/my-products`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(res.data.data || res.data.products || []);
    } catch (err) {
      console.error(err);
      alert("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete this product?")) return;

    try {
      await axios.delete(`${backendURL}/products/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      alert("Delete failed");
    }
  };

  const handleEdit = (id) => navigate(`/business/edit-product/${id}`);

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus =
      currentStatus === "active"
        ? "disabled"
        : currentStatus === "disabled"
        ? "active"
        : currentStatus;

    try {
      await axios.put(
        `${backendURL}/products/${id}`,
        { status: nextStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      setProducts((prev) =>
        prev.map((p) =>
          p._id === id ? { ...p, status: nextStatus } : p
        )
      );
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  const filteredProducts = categoryFilter
    ? products.filter((p) => p.category === categoryFilter)
    : products;

  return (
    <div className="container mt-4">
      <h2>My Products</h2>

      <div className="mb-3">
        <label>Filter by Category: </label>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%" }}>
          <thead>
            <tr>
              <th>Image</th>
              <th>Title</th>
              <th>Category</th>
              <th>Deal Type</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((p) => (
              <tr key={p._id}>
                <td>
                  {p.images?.[0] ? (
                    <img
                      src={`${backendURL}${p.images[0]}`}
                      alt={p.title}
                      style={{ width: "60px", height: "60px", objectFit: "cover" }}
                    />
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{p.title}</td>
                <td>{p.category}</td>
                <td>{p.dealType}</td>
                <td>${p.price}</td>
                <td>{p.discount}%</td>
                <td>{p.stockQuantity}</td>
                <td>
                  <button onClick={() => toggleStatus(p._id, p.status)}>
                    {p.status}
                  </button>
                </td>
                <td>
                  <button onClick={() => handleEdit(p._id)}>Edit</button>
                  <button onClick={() => handleDelete(p._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
