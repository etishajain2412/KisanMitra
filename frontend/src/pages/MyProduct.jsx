import { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
axios.defaults.withCredentials=true
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const MyProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});

  const token = Cookies.get("token");

  useEffect(() => {
    const fetchMyProducts = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/products/myProducts`, {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });
        setProducts(response.data);
      } catch (error) {
        setError("Failed to load your products");
      }
      setLoading(false);
    };

    fetchMyProducts();
  }, [token]);

  const handleDelete = async (productId) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;

    try {
      await axios.delete(`${backendUrl}/api/products/delete/${productId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter((product) => product._id !== productId));
    } catch (error) {
      setError("Error deleting product");
    }
  };

  const toggleBidding = async (productId, isBiddingEnabled, minimumBidAmount) => {
    try {
      const response = await axios.put(
        `${backendUrl}/api/products/toggleBidding/${productId}`,
        { isBiddingEnabled, minimumBidAmount },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setProducts(
        products.map((product) =>
          product._id === productId ? { ...product, ...response.data.product } : product
        )
      );
    } catch (error) {
      setError("Error updating bidding status");
    }
  };

  const handleEdit = (product) => {
    setEditingProductId(product._id);
    setEditedProduct({ ...product });
  };

  const handleUpdate = async (productId) => {
    try {
      const formData = new FormData();
      formData.append("name", editedProduct.name);
      formData.append("description", editedProduct.description);
      formData.append("price", editedProduct.price);
      formData.append("stock", editedProduct.stock);

      if (editedProduct.images && editedProduct.images.length > 0) {
        for (let image of editedProduct.images) {
          formData.append("images", image);
        }
      }

      const response = await axios.put(
        `${backendUrl}/api/products/update/${productId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      );

      setProducts(
        products.map((product) =>
          product._id === productId ? { ...product, ...response.data.product } : product
        )
      );

      setEditingProductId(null);
    } catch (error) {
      setError("Error updating product");
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading your products...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">My Products</h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-500">No products added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white shadow-md rounded-lg p-4">
              {product.images.length > 0 ? (
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-40 object-cover rounded-md"
                />
              ) : (
                <div className="w-full h-40 bg-gray-200 flex items-center justify-center text-gray-500">
                  No Image
                </div>
              )}

              {editingProductId === product._id ? (
                <>
                  <input
                    type="text"
                    value={editedProduct.name}
                    onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                  />
                  <textarea
                    value={editedProduct.description}
                    onChange={(e) =>
                      setEditedProduct({ ...editedProduct, description: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                  ></textarea>
                  <input
                    type="number"
                    value={editedProduct.price}
                    onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                  />
                  <input
                    type="number"
                    value={editedProduct.stock}
                    onChange={(e) => setEditedProduct({ ...editedProduct, stock: e.target.value })}
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                  />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={(e) =>
                      setEditedProduct({ ...editedProduct, images: Array.from(e.target.files) })
                    }
                    className="w-full p-2 border border-gray-300 rounded mt-2"
                  />

                  <button
                    onClick={() => handleUpdate(product._id)}
                    className="mt-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingProductId(null)}
                    className="mt-2 ml-2 bg-gray-600 hover:bg-gray-700 text-white py-1 px-3 rounded"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-bold mt-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm">{product.description}</p>

                  <div className="flex justify-between items-center mt-2">
                    <span className="text-lg font-semibold text-purple-600">₹{product.price}</span>
                    <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                  </div>

                  {product.isBiddingEnabled ? (
                    <div className="mt-2">
                      <p className="text-sm text-green-600">
                        Bidding Enabled | Min Bid: ₹{product.minimumBidAmount}
                      </p>
                      <button
                        onClick={() => toggleBidding(product._id, false, 0)}
                        className="mt-2 bg-red-600 hover:bg-red-700 text-white py-1 px-3 rounded"
                      >
                        Disable Bidding
                      </button>
                    </div>
                  ) : (
                    <div className="mt-2">
                      <input
                        type="number"
                        placeholder="Min Bid Amount"
                        className="w-full p-2 border border-gray-300 rounded"
                        onChange={(e) =>
                          setProducts(
                            products.map((p) =>
                              p._id === product._id
                                ? { ...p, tempMinBid: e.target.value }
                                : p
                            )
                          )
                        }
                      />
                      <button
                        onClick={() =>
                          toggleBidding(product._id, true, product.tempMinBid || 0)
                        }
                        className="mt-2 bg-green-600 hover:bg-green-700 text-white py-1 px-3 rounded"
                      >
                        Enable Bidding
                      </button>
                    </div>
                  )}

                  <div className="flex gap-2 mt-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(product._id)}
                      className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProducts;
