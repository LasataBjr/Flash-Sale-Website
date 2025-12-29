import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function ProductManagement() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [filters, setFilters] = useState({
    category: "",
    subCategory: "",
    dealType: "",
    minPrice: "",
    maxPrice: "",
    sortBy: "",
  });

  const backendURL = import.meta.env.VITE_API_URL;

  const categoryMap = {
    "Fashion & Lifestyle": ["Men", "Women", "Kids", "Accessories"],
    "Cosmetic/Beauty": ["Skincare", "Makeup", "Haircare", "Fragrances"],
    "Electronics & Gadgets": ["Mobile", "Laptop", "Wearables", "Audio"],
    "Sports & Fitness": ["Gym Equipment", "Sportswear", "Outdoor"],
    "Automotive & Accessories": ["Car Accessories", "Motorbike Accessories"],
    "Home Appliances": ["Kitchen", "Laundry", "Cleaning"],
    "Grocery": ["Vegetables", "Fruits", "Snacks", "Beverages"],
    "Stationery": ["Office Supplies", "School Supplies"],
    "Household & Living": ["Furniture", "Decor", "Bedding"],
    "Health & Wellness": ["Supplements", "Fitness Gear"],
    "Accommodation": ["Hotel", "Guesthouse", "Hostel"],
    "Entertainment Hub": ["Movies", "Games", "Events"],
  };

  const dealTypes = [
    "Flash Deal",
    "Discount Offer",
    "Limited Time Offer",
    "Buy One Get One",
    "Seasonal Offer",
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

  const [previewImages, setPreviewImages] = useState(null);
  const handleEdit = (id) => navigate(`/business/products/edit/${id}`);
  const handleAddProduct = () => navigate("/business/products/new");

  const toggleStatus = async (id, currentStatus) => {
    const nextStatus = currentStatus === "active" ? "disabled" : "active";

    try {
      const res = await axios.patch(
        `${backendURL}/products/${id}/status`,
        { status: nextStatus },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      );

      if (res.data.success) {
        setProducts((prev) =>
          prev.map((p) => (p._id === id ? { ...p, status: nextStatus } : p))
        );
      }
    } catch (err) {
      console.error(err);
      alert("Failed to update status");
    }
  };

  // Filter and sort logic
  const filteredProducts = products
    .filter((p) =>
      filters.category ? p.category === filters.category : true
    )
    .filter((p) =>
      filters.subCategory ? p.subCategory === filters.subCategory : true
    )
    .filter((p) =>
      filters.dealType ? p.dealType === filters.dealType : true
    )
    .filter((p) =>
      filters.minPrice ? p.price >= parseFloat(filters.minPrice) : true
    )
    .filter((p) =>
      filters.maxPrice ? p.price <= parseFloat(filters.maxPrice) : true
    )
    .sort((a, b) => {
      if (filters.sortBy === "priceAsc") return a.price - b.price;
      if (filters.sortBy === "priceDesc") return b.price - a.price;
      if (filters.sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (filters.sortBy === "oldest")
        return new Date(a.createdAt) - new Date(b.createdAt);
      return 0;
    });

  return (
    <div className="container mt-4">
      <h2>My Products</h2>
      <button
        onClick={handleAddProduct}
        style={{ marginBottom: "20px", padding: "10px 20px" }}
      >
        Add Product / Post Deal
      </button>

      <div
        style={{
          display: "flex",
          gap: "20px",
          marginBottom: "20px",
          flexWrap: "wrap",
        }}
      >
        {/* Category */}
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters({
              ...filters,
              category: e.target.value,
              subCategory: "", // reset subCategory
            })
          }
        >
          <option value="">All Categories</option>
          {Object.keys(categoryMap).map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        {/* Subcategory */}
        <select
          value={filters.subCategory}
          onChange={(e) =>
            setFilters({ ...filters, subCategory: e.target.value })
          }
          disabled={!filters.category}
        >
          <option value="">All Subcategories</option>
          {filters.category &&
            categoryMap[filters.category]?.map((sub) => (
              <option key={sub} value={sub}>
                {sub}
              </option>
            ))}
        </select>

        {/* Deal Type */}
        <select
          value={filters.dealType}
          onChange={(e) =>
            setFilters({ ...filters, dealType: e.target.value })
          }
        >
          <option value="">All Deal Types</option>
          {dealTypes.map((d) => (
            <option key={d} value={d}>
              {d}
            </option>
          ))}
        </select>

        {/* Price range */}
        <input
          type="number"
          placeholder="Min Price"
          value={filters.minPrice}
          onChange={(e) =>
            setFilters({ ...filters, minPrice: e.target.value })
          }
        />
        <input
          type="number"
          placeholder="Max Price"
          value={filters.maxPrice}
          onChange={(e) =>
            setFilters({ ...filters, maxPrice: e.target.value })
          }
        />

        {/* Sort By */}
        <select
          value={filters.sortBy}
          onChange={(e) => setFilters({ ...filters, sortBy: e.target.value })}
        >
          <option value="">Sort By</option>
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priceAsc">Price: Low to High</option>
          <option value="priceDesc">Price: High to Low</option>
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
              <th>Subcategory</th>
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
                  {p.images?.length ? (
                    <button onClick={() => setPreviewImages(p.images)}>
                      View ({p.images.length})
                    </button>
                  ) : (
                    "No Image"
                  )}
                </td>
                <td>{p.title}</td>
                <td>{p.category}</td>
                <td>{p.subCategory || "-"}</td>
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
      {previewImages && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 999,
          }}
          onClick={() => setPreviewImages(null)}
        >
          <div
            style={{
              background: "#fff",
              padding: 20,
              display: "flex",
              gap: 10,
              flexWrap: "wrap",
              maxWidth: 600,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {previewImages.map((img, i) => (
              <img
                key={i}
                src={`${backendURL.replace("/api", "")}${img}`}
                style={{ width: 150, height: 150, objectFit: "cover" }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
