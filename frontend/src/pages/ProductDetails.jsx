import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ProductDetails = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bidAmount, setBidAmount] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [placingBid, setPlacingBid] = useState(false);
  const [error, setError] = useState("");
  const userId = localStorage.getItem("userId"); // Assume userId is stored in localStorage

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/products/getProduct/${id}`);
        setProduct(response.data);
      } catch (error) {
        console.error("Error fetching product details:", error);
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  const handlePlaceBid = async () => {
    if (!bidAmount || bidAmount < product.minimumBidAmount) {
      setError(`Bid amount must be at least ₹${product.minimumBidAmount}`);
      return;
    }

    setError("");
    setPlacingBid(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/products/placeBid/${id}`,
        { bidAmount, quantity },
        { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
      );

      setProduct(response.data.product);
      setBidAmount("");
      setQuantity(1);
    } catch (error) {
      setError(error.response?.data?.message || "Error placing bid");
    }

    setPlacingBid(false);
  };

  if (loading) return <p className="text-center text-gray-500">Loading product details...</p>;
  if (!product) return <p className="text-center text-red-500">Product not found</p>;

  const userBid = product.bids.find((bid) => bid.userId === userId);
  const otherBids = product.bids.filter((bid) => bid.userId !== userId);

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-3xl font-bold text-gray-800">{product.name}</h2>

      <div className="mt-4 flex gap-4 overflow-x-auto">
        {product.images?.length > 0 ? (
          product.images.map((image, index) => (
            <img key={index} src={image} alt={product.name} className="w-64 h-64 object-cover rounded-md shadow-md" />
          ))
        ) : (
          <div className="w-64 h-64 bg-gray-200 flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
      </div>

      <p className="text-gray-600 mt-4">{product.description}</p>
      <p className="text-lg font-semibold text-purple-600 mt-2">Price: ₹{product.price}</p>
      <p className="text-sm text-gray-500">Stock: {product.stock}</p>

      {product.isBiddingEnabled && (
        <div className="mt-6 p-4 bg-green-100 border-l-4 border-green-600 rounded-md">
          <h3 className="text-lg font-semibold text-green-700">Bidding is Enabled</h3>
          <p className="text-green-600">Minimum Bid Amount: ₹{product.minimumBidAmount}</p>

          {/* Bidding Form */}
          <div className="mt-4">
            <input
              type="number"
              placeholder="Enter bid amount"
              value={bidAmount}
              onChange={(e) => setBidAmount(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <input
              type="number"
              placeholder="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              className="w-full p-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              min="1"
            />
            {error && <p className="text-red-500 mt-1">{error}</p>}

            <button
              onClick={handlePlaceBid}
              className="mt-3 bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded w-full"
              disabled={placingBid}
            >
              {placingBid ? "Placing Bid..." : userBid ? "Update Bid" : "Place a Bid"}
            </button>
          </div>

          {/* User's Own Bid */}
          {userBid && (
            <div className="mt-4 p-3 bg-white shadow rounded-md">
              <h3 className="text-md font-semibold text-blue-700">Your Bid</h3>
              <p className="text-lg text-blue-600">₹{userBid.bidAmount} for {userBid.quantity} units</p>
              <p className="text-xs text-gray-500">Updated on {new Date(userBid.updatedAt).toLocaleDateString()}</p>
            </div>
          )}

          {/* Other Users' Bids */}
          {otherBids.length > 0 && (
            <div className="mt-4 p-3 bg-white shadow rounded-md">
              <h3 className="text-md font-semibold text-gray-700">Other Bids</h3>
              {otherBids.map((bid, index) => (
                <div key={index} className="p-2 border-b">
                  <p className="text-lg text-gray-600">₹{bid.bidAmount} for {bid.quantity} units</p>
                  <p className="text-xs text-gray-400">Placed on {new Date(bid.createdAt).toLocaleDateString()}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
