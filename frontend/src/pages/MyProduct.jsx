import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyProduct() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editableProduct, setEditableProduct] = useState(null);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    fetchMyProducts();
  }, []);

  const fetchMyProducts = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/products/myProducts', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setProducts(res.data);
    } catch (err) {
      setError('Failed to fetch products.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e, productId) => {
    const { name, value, type, checked } = e.target;
    setEditableProduct((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value,
      _id: productId,
    }));
  };

  const handleSave = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/products/updateProduct/${editableProduct._id}`,
        editableProduct,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      fetchMyProducts(); // Refresh the products
      setEditableProduct(null); // Reset editing state
    } catch (err) {
      setError('Failed to save changes.');
    }
  };

  const handleSellToBidders = async (productId, stock) => {
    try {
      const res = await axios.post(
        `http://localhost:5000/api/products/sellToHighestBidder/${productId}`,
        { stock },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      fetchMyProducts(); // Refresh the products
      setSuccessMessage(res.data.buyers.join('\n')); // Display buyers who got the product
    } catch (err) {
      alert('Failed to complete the sale.');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">My Products</h2>

      {successMessage && (
        <div className="bg-green-500 text-white p-3 rounded mb-4">
          {successMessage.split('\n').map((msg, index) => (
            <p key={index}>{msg}</p>
          ))}
        </div>
      )}

      {loading ? (
        <p>Loading products...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : products.length === 0 ? (
        <p>No products added yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {products.map((product) => (
            <div key={product._id} className="p-4 border rounded-lg shadow-md">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md"
              />
              {editableProduct && editableProduct._id === product._id ? (
                <>
                  <input
                    type="text"
                    name="name"
                    value={editableProduct.name}
                    onChange={(e) => handleChange(e, product._id)}
                    className="w-full p-2 mt-2 border rounded"
                    placeholder="Product Name"
                  />
                  <textarea
                    name="description"
                    value={editableProduct.description}
                    onChange={(e) => handleChange(e, product._id)}
                    className="w-full p-2 mt-2 border rounded"
                    placeholder="Description"
                  />
                  <input
                    type="number"
                    name="price"
                    value={editableProduct.price}
                    onChange={(e) => handleChange(e, product._id)}
                    className="w-full p-2 mt-2 border rounded"
                    placeholder="Price"
                  />
                  <input
                    type="text"
                    name="category"
                    value={editableProduct.category}
                    onChange={(e) => handleChange(e, product._id)}
                    className="w-full p-2 mt-2 border rounded"
                    placeholder="Category"
                  />
                  <input
                    type="number"
                    name="stock"
                    value={editableProduct.stock}
                    onChange={(e) => handleChange(e, product._id)}
                    className="w-full p-2 mt-2 border rounded"
                    placeholder="Stock"
                  />
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="isBiddingEnabled"
                      checked={editableProduct.isBiddingEnabled}
                      onChange={(e) => handleChange(e, product._id)}
                      className="mr-2"
                    />
                    <span>Enable Bidding</span>
                  </div>

                  {editableProduct.isBiddingEnabled && (
                    <input
                      type="number"
                      name="minBidPrice"
                      value={editableProduct.minBidPrice}
                      onChange={(e) => handleChange(e, product._id)}
                      className="w-full p-2 mt-2 border rounded"
                      placeholder="Minimum Bid Price"
                    />
                  )}

                  <button
                    onClick={handleSave}
                    className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
                  >
                    Save Changes
                  </button>
                </>
              ) : (
                <>
                  <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
                  <p className="text-gray-600">{product.description}</p>
                  <p className="text-green-600 font-bold mt-1">₹{product.price}</p>
                  <p className="text-gray-500">Stock: {product.stock}</p>
                  <p className="text-gray-400 text-sm">Category: {product.category}</p>

                  {product.isBiddingEnabled && product.bids.length > 0 && (
                    <div className="mt-2">
                      <h4 className="text-lg font-semibold">Bidders:</h4>
                      {product.bids
                        .sort((a, b) => b.bidAmount - a.bidAmount)
                        .map((bid) => (
                          <div key={bid._id} className="border-t pt-2 mt-2">
                            <p className="font-semibold">{bid.userId.name}</p>
                            <p className="text-green-500">Bid: ₹{bid.bidAmount}</p>
                            <p className="text-gray-500">Email: {bid.userId.email}</p>
                            <p className="text-gray-400 text-sm">
                              Date: {new Date(bid.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                    </div>
                  )}

                  {product.isBiddingEnabled && !product.sold && (
                    <button
                      onClick={() => handleSellToBidders(product._id, product.stock)}
                      className="mt-4 bg-green-500 text-white py-2 px-4 rounded"
                    >
                      Sell to Highest Bidders
                    </button>
                  )}

                  <button
                    onClick={() => setEditableProduct(product)}
                    className="mt-4 bg-gray-500 text-white py-2 px-4 rounded"
                  >
                    Edit Product
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProduct;
