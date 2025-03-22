import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/products/getProducts");
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
      setLoading(false);
    };

    fetchProducts();
  }, []);

  if (loading) return <p className="text-center text-gray-500">Loading products...</p>;

  return (
    <div className="container mx-auto p-6">
      <h2 className="text-2xl font-bold text-gray-700 mb-4">Available Products</h2>

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

            <h3 className="text-lg font-bold mt-2">{product.name}</h3>
            <p className="text-gray-600 text-sm">{product.description}</p>

            <div className="flex justify-between items-center mt-2">
              <span className="text-lg font-semibold text-purple-600">₹{product.price}</span>
              <span className="text-sm text-gray-500">Stock: {product.stock}</span>
            </div>

            {product.isBiddingEnabled && (
              <p className="text-sm text-green-600 mt-1">
                Bidding Enabled | Min Bid: ₹{product.minimumBidAmount}
              </p>
            )}

            {/* View Details Button */}
            <Link to={`/product/${product._id}`}>
              <button className="w-full mt-3 bg-purple-600 hover:bg-purple-700 text-white py-2 rounded-md">
                View Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductsList;
