import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function Product() {
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '',
    category: 'crop',
    stock: 1,
    images: [],
    isBiddingEnabled: false, // 🔹 New field for bidding
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;

    setProduct((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value, // 🔹 Handle checkbox
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + product.images.length > 5) {
      return alert('You can upload up to 5 images only!');
    }

    setProduct((prev) => ({
      ...prev,
      images: [...prev.images, ...files],
    }));

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviewImages((prev) => [...prev, ...newPreviews]);
  };

  const handleRemoveImage = (index) => {
    setProduct((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));

    setPreviewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!checkToken() || isSubmitting) return;

    setIsSubmitting(true);
    const formData = new FormData();

    formData.append('name', product.name);
    formData.append('description', product.description);
    formData.append('price', product.price);
    formData.append('category', product.category);
    formData.append('stock', product.stock);
    formData.append('isBiddingEnabled', product.isBiddingEnabled); // 🔹 Include bidding option

    product.images.forEach((image) => {
      formData.append('images', image);
    });

    try {
      const res = await axios.post(
        'http://localhost:5000/api/products/addProduct',
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setMessage('Product added successfully!');
      setProduct({
        name: '',
        description: '',
        price: '',
        category: 'crop',
        stock: 1,
        images: [],
        isBiddingEnabled: false, // Reset bidding option
      });
      setPreviewImages([]);
    } catch (error) {
      setMessage('Failed to add product: ' + (error.response?.data?.message || 'An error occurred'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white shadow-lg rounded-lg">
        <h2 className="text-3xl font-bold text-center text-gray-700 mb-4">Add New Product</h2>
        <form onSubmit={handleSubmit} className="w-full">
          <input
            type="text"
            name="name"
            value={product.name}
            onChange={handleInputChange}
            placeholder="Product Name"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="text"
            name="description"
            value={product.description}
            onChange={handleInputChange}
            placeholder="Product Description"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <input
            type="number"
            name="price"
            value={product.price}
            onChange={handleInputChange}
            placeholder="Price"
            className="w-full p-2 mb-2 border rounded"
            required
          />
          <select
            name="category"
            value={product.category}
            onChange={handleInputChange}
            className="w-full p-2 mb-2 border rounded"
            required
          >
            <option value="crop">Crop</option>
            <option value="fertilizer">Fertilizer</option>
            <option value="equipment">Equipment</option>
          </select>
          <input
            type="number"
            name="stock"
            value={product.stock}
            onChange={handleInputChange}
            placeholder="Stock Quantity"
            className="w-full p-2 mb-4 border rounded"
            required
          />

          {/* 🔹 Bidding Enable Checkbox */}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              name="isBiddingEnabled"
              checked={product.isBiddingEnabled}
              onChange={handleInputChange}
              className="mr-2"
            />
            <label className="text-gray-700">Enable Bidding</label>
          </div>

          {/* File Input */}
          <input
            type="file"
            name="images"
            onChange={handleImageChange}
            multiple
            className="w-full p-2 mb-4 border rounded"
            accept="image/*"
          />

          {/* Image Previews with Remove Option */}
          <div className="flex flex-wrap gap-2 mb-4">
            {previewImages.map((src, index) => (
              <div key={index} className="relative w-24 h-24">
                <img src={src} alt="Preview" className="w-full h-full object-cover rounded-lg" />
                <button
                  type="button"
                  className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full px-2 py-1"
                  onClick={() => handleRemoveImage(index)}
                >
                  ✖
                </button>
              </div>
            ))}
          </div>

          <button
            type="submit"
            className="w-full p-3 bg-green-500 text-white rounded-lg hover:bg-green-600"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Adding...' : 'Add Product'}
          </button>
        </form>

        {message && <p className="text-center mt-2 text-green-500">{message}</p>}
      </div>
    </div>
  );
}

export default Product;
