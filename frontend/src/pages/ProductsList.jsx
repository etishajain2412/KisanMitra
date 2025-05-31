import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Loader2, Tag, Sprout, Award, Tractor, Clock } from "lucide-react";
import { Button } from "../components/ui/button";

const getCategoryIcon = (category) => {
  switch (category) {
    case "crop":
      return <Sprout size={18} className="text-green-600" />;
    case "fertilizer":
      return <Sprout size={18} className="text-amber-600" />;
    case "equipment":
      return <Tractor size={18} className="text-blue-600" />;
    default:
      return <Tag size={18} className="text-purple-600" />;
  }
};

const getTimeRemaining = (endDate) => {
  if (!endDate) return "No end date";
  const now = new Date();
  const end = new Date(endDate);
  const diff = end - now;
  
  if (diff <= 0) return "Bidding ended";
  
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  
  return `${days}d ${hours}h remaining`;
};

const ProductsList = () => {
  const [productsData, setProductsData] = useState({
    products: [],
    loading: true,
    error: null
  });
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setProductsData(prev => ({ ...prev, loading: true, error: null }));
        const response = await axios.get("http://localhost:5000/api/products/getProducts");
        
        // Ensure we always have an array
        const receivedProducts = Array.isArray(response.data?.products) 
          ? response.data.products 
          : [];
        
        setProductsData({
          products: receivedProducts,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error("Error fetching products:", err);
        setProductsData({
          products: [],
          loading: false,
          error: "Failed to load products. Please try again later."
        });
      }
    };

    fetchProducts();
  }, []);

  // Safely get filtered products
  const filteredProducts = Array.isArray(productsData.products)
    ? filter === "all"
      ? productsData.products
      : productsData.products.filter(product => product?.category === filter)
    : [];

  if (productsData.loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-green-600" />
        <span className="ml-2 text-green-700">Loading products...</span>
      </div>
    );
  }

  if (productsData.error) {
    return (
      <div className="text-center py-12 bg-red-50 rounded-lg">
        <div className="mx-auto h-12 w-12 text-red-500 mb-4 flex items-center justify-center">
          <Tag size={32} />
        </div>
        <h3 className="text-xl font-medium text-red-800 mb-2">Error Loading Products</h3>
        <p className="text-red-600">{productsData.error}</p>
        <Button 
          onClick={() => window.location.reload()} 
          className="mt-4 bg-red-600 hover:bg-red-700"
        >
          Retry
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg border border-green-100 shadow-sm p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-green-800">Marketplace</h1>
            <p className="text-green-600">Browse agricultural products from farmers</p>
          </div>

          <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0 w-full sm:w-auto">
            {["all", "crop", "fertilizer", "equipment"].map((cat) => (
              <Button
                key={cat}
                variant="outline"
                size="sm"
                onClick={() => setFilter(cat)}
                className={`whitespace-nowrap ${
                  filter === cat 
                    ? "bg-green-50 text-green-700 border-green-200" 
                    : ""
                }`}
              >
                {getCategoryIcon(cat)}
                <span className="ml-1 capitalize">
                  {cat === "all" ? "All Products" : cat}
                </span>
              </Button>
            ))}
          </div>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="text-center py-12 bg-green-50 rounded-lg">
            <Tag className="mx-auto h-12 w-12 text-green-500 mb-4" />
            <h3 className="text-xl font-medium text-green-800 mb-2">No Products Found</h3>
            <p className="text-green-600">
              {filter === "all" 
                ? "There are currently no products available." 
                : `No ${filter} products available.`}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <div
                key={product._id}
                className="bg-white border border-green-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="relative h-48 bg-gray-100">
                  {product.images?.[0] ? (
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center bg-green-50">
                      <Tag size={40} className="text-green-200" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 bg-white/90 px-2 py-1 rounded-full shadow-sm flex items-center text-xs font-medium backdrop-blur-sm">
                    {getCategoryIcon(product.category)}
                    <span className="ml-1 capitalize">{product.category}</span>
                  </div>
                </div>

                <div className="p-4 flex flex-col flex-grow">
                  <h3 className="text-lg font-bold text-green-800 line-clamp-1">
                    {product.name}
                  </h3>
                  <p className="text-gray-600 text-sm mt-1 line-clamp-2">
                    {product.description}
                  </p>

                  <div className="mt-3 space-y-2">
                    {product.isBiddingEnabled ? (
                      <>
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-amber-600 flex items-center">
                            <Award size={16} className="mr-1" />
                            Min Bid: ₹{product.minimumBidAmount?.toLocaleString()}
                          </span>
                          <span className="text-xs text-gray-500">
                            {product.bids?.length || 0} bids
                          </span>
                        </div>
                        {product.biddingEndDate && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Clock size={14} className="mr-1" />
                            {getTimeRemaining(product.biddingEndDate)}
                          </div>
                        )}
                      </>
                    ) : (
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-semibold text-green-700">
                          ₹{product.price?.toLocaleString()}
                        </span>
                        <span className="text-sm text-gray-500">
                          Stock: {product.stock}
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="mt-auto pt-4">
                    <Link to={`/product/${product._id}`}>
                      <Button className="w-full bg-green-600 hover:bg-green-700 text-white">
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductsList;