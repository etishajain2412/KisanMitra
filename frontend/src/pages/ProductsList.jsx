import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { Loader2, Tag, Sprout, Award, Tractor } from "lucide-react";
import { Button } from "../components/ui/button";
import NavigationBar from "../components/NavigationBar";
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

const ProductsList = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

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

  const filteredProducts = filter === "all"
    ? products
    : products.filter(product => product.category === filter);

  return (
    <><NavigationBar/>
    <div className="bg-white rounded-lg border border-green-100 shadow-sm p-6 mt-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
        <h2 className="text-2xl font-bold text-green-800 mb-4 sm:mb-0">
          Marketplace Products
        </h2>

        <div className="flex space-x-2 overflow-x-auto pb-2 sm:pb-0">
          {["all", "crop", "fertilizer", "equipment", "others"].map((cat) => (
            <Button
              key={cat}
              variant="outline"
              size="sm"
              onClick={() => setFilter(cat)}
              className={`${filter === cat ? "bg-green-50 text-green-700 border-green-200" : ""}`}
            >
              {cat === "crop" && <Sprout size={16} className="mr-1" />}
              {cat === "fertilizer" && <Sprout size={16} className="mr-1" />}
              {cat === "equipment" && <Tractor size={16} className="mr-1" />}
              {cat === "others" && <Tag size={16} className="mr-1" />}
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <Loader2 size={32} className="animate-spin text-green-600" />
          <span className="ml-2 text-green-700">Loading products...</span>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-green-50 rounded-lg">
          <Tag className="mx-auto h-12 w-12 text-green-500 mb-4" />
          <h3 className="text-xl font-medium text-green-800 mb-2">No Products Found</h3>
          <p className="text-green-600">There are no products available in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="bg-white border border-green-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="relative h-48 bg-gray-100">
                {product.images.length > 0 ? (
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-green-50">
                    <Tag size={40} className="text-green-200" />
                  </div>
                )}
                <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-full shadow-sm flex items-center text-xs font-medium">
                  {getCategoryIcon(product.category)}
                  <span className="ml-1 capitalize">{product.category}</span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="text-lg font-bold text-green-800">{product.name}</h3>
                <p className="text-gray-600 text-sm mt-1 line-clamp-2">{product.description}</p>

                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-semibold text-green-700">₹{product.price}</span>
                  <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                </div>

                {product.isBiddingEnabled && (
                  <div className="mt-2 flex items-center text-sm text-amber-600">
                    <Award size={16} className="mr-1" />
                    <span>Bidding Enabled | Min Bid: ₹{product.minimumBidAmount}</span>
                  </div>
                )}

                <Link to={`/product/${product._id}`}>
                  <Button className="w-full mt-4 bg-green-600 hover:bg-green-700 text-white">
                    View Details
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
    </>
  );
};

export default ProductsList;
