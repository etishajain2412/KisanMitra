import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function DisplayProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bidAmount, setBidAmount] = useState({});
  const [userId, setUserId] = useState(localStorage.getItem('userId')); // Assuming you store the user ID in localStorage
  const [feedback, setFeedback] = useState('');

  // Fetch all products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/products/display');
        setProducts(res.data);
      } catch (err) {
        setError('Failed to fetch products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleBidChange = (e, productId) => {
    setBidAmount({
      ...bidAmount,
      [productId]: e.target.value,
    });
  };

  const placeBid = async (productId) => {
    const bid = bidAmount[productId];
    if (!bid || bid <= 0) {
      alert('Please enter a valid bid amount.');
      return;
    }

    try {
      const product = products.find((prod) => prod._id === productId);
      if (product.minBidPrice && bid < product.minBidPrice) {
        alert(`Your bid must be at least $${product.minBidPrice}`);
        return;
      }

      const res = await axios.post(
        `http://localhost:5000/api/products/bid/${productId}`,
        { amount: bid },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );

      setFeedback('Bid placed successfully!');
      setBidAmount((prevState) => ({ ...prevState, [productId]: '' }));
      // Reload the product details to show the updated bids
      const updatedProducts = products.map((product) =>
        product._id === productId ? { ...product, bids: [...product.bids, res.data.bid] } : product
      );
      setProducts(updatedProducts);
    } catch (err) {
      setFeedback('Failed to place bid. Please try again.');
    }
  };

  if (loading) return <div className="text-center mt-10 text-xl">Loading...</div>;
  if (error) return <div className="text-center mt-10 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h2 className="text-3xl font-bold text-center text-gray-700 mb-6">All Products</h2>

      {products.length === 0 ? (
        <p className="text-center text-gray-600">No products available</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product._id} className="bg-white p-4 shadow-md rounded-lg">
              <img
                src={product.images?.[0] || 'https://via.placeholder.com/150'}
                alt={product.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <h3 className="text-xl font-semibold mt-2">{product.name}</h3>
              <p className="text-gray-600">{product.description}</p>
              <p className="text-green-600 font-bold mt-1">${product.price}</p>
              <p className="text-gray-500 text-sm">Stock: {product.stock}</p>
              <p className="text-gray-500 text-sm">Category: {product.category}</p>
              <Link to="/payment">
       <button className="btn btn-success">Proceed to Payment</button>
      </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default DisplayProducts;
