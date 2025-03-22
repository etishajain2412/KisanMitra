import { useState } from "react";
import axios from "axios";

const Product = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "crop",
    stock: "1",
    isBiddingEnabled: false,
    minimumBidAmount: "",
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle file upload preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({ ...prev, images: files }));

    // Preview images
    const previews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages(previews);
  };

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const productData = new FormData();
    for (const key in formData) {
      if (key === "images") {
        formData.images.forEach((image) => productData.append("images", image));
      } else {
        productData.append(key, formData[key]);
      }
    }

    try {
      const token = localStorage.getItem("token"); // Assuming user is logged in
      const response = await axios.post(
        "http://localhost:5000/api/products/addProduct",
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("Product added successfully!");
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "crop",
        stock: "1",
        isBiddingEnabled: false,
        minimumBidAmount: "",
        images: [],
      });
      setPreviewImages([]);
    } catch (error) {
      setMessage(error.response?.data?.message || "Error adding product");
    }

    setLoading(false);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg mt-10">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Add a New Product</h2>

      {message && <p className="mb-4 text-center text-green-600">{message}</p>}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-gray-600">Product Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-gray-600">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
          ></textarea>
        </div>

        {/* Price */}
        <div>
          <label className="block text-gray-600">Price (₹)</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-gray-600">Category</label>
          <select
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
          >
            <option value="crop">Crop</option>
            <option value="fertilizer">Fertilizer</option>
            <option value="equipment">Equipment</option>
          </select>
        </div>

        {/* Stock */}
        <div>
          <label className="block text-gray-600">Stock</label>
          <input
            type="number"
            name="stock"
            value={formData.stock}
            onChange={handleChange}
            min="1"
            className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
          />
        </div>

        {/* Bidding Option */}
        <div className="flex items-center">
          <input
            type="checkbox"
            name="isBiddingEnabled"
            checked={formData.isBiddingEnabled}
            onChange={handleChange}
            className="w-5 h-5 text-purple-600 focus:ring-purple-500"
          />
          <label className="ml-2 text-gray-600">Enable Bidding</label>
        </div>

        {/* Minimum Bid Amount (Only if Bidding is Enabled) */}
        {formData.isBiddingEnabled && (
          <div>
            <label className="block text-gray-600">Minimum Bid Amount (₹)</label>
            <input
              type="number"
              name="minimumBidAmount"
              value={formData.minimumBidAmount}
              onChange={handleChange}
              required
              className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
            />
          </div>
        )}

        {/* Image Upload */}
        <div>
          <label className="block text-gray-600">Upload Images</label>
          <input
            type="file"
            name="images"
            multiple
            accept="image/*"
            onChange={handleImageChange}
            className="w-full p-2 border rounded-md focus:ring focus:ring-purple-300"
          />
        </div>

        {/* Image Preview */}
        {previewImages.length > 0 && (
          <div className="flex space-x-2 mt-2">
            {previewImages.map((img, index) => (
              <img key={index} src={img} alt="Preview" className="w-16 h-16 rounded-md object-cover" />
            ))}
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          className={`w-full py-2 text-white rounded-md ${
            loading ? "bg-gray-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700"
          }`}
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Product;
