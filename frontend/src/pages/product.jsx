import { useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import NavigationBar from "../components/NavigationBar";

const Product = () => {
  const [activeView, setActiveView] = useState("addProduct");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "crop",
    stock: "1",
    isBiddingEnabled: false,
    minimumBidAmount: "",
    images: []
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? e.target.checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = new FormData();
    for (const key in formData) {
      if (key === "images") {
        formData.images.forEach((image) => productData.append("images", image));
      } else {
        productData.append(key, formData[key].toString());
      }
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/products/addProduct",
        productData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    } catch (error) {
      console.error("Error adding product", error);
    }
    setLoading(false);
  };

  const renderActiveView = () => {
    switch (activeView) {
      case "addProduct":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg border border-green-100 shadow-sm overflow-hidden mt-6">
              <div className="bg-gradient-to-r from-green-100 to-emerald-50 p-6">
                <h2 className="text-2xl font-bold text-green-800">Add New Product</h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6">
                <div className="mb-8">
                  <input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Enter product name"
                    className="mt-1"
                  />
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Describe your product"
                    className="mt-1 min-h-[100px]"
                  />
                  <input
                    id="price"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleChange}
                    required
                    min="0"
                    placeholder="Enter price"
                    className="mt-1"
                  />
                </div>
                <div className="flex justify-end pt-4">
                  <Button 
                    type="submit" 
                    disabled={loading} 
                    className={cn(
                      "bg-green-600 hover:bg-green-700 text-white px-6",
                      loading && "opacity-70 cursor-not-allowed"
                    )}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="mr-2 animate-spin" />
                        Adding...
                      </>
                    ) : (
                      "Add Product"
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        );
      case "viewProducts":
        return <div className="text-green-800">View Products Component</div>;
      case "categories":
        return <div className="text-green-800">Categories Component</div>;
      case "orders":
        return <div className="text-green-800">Orders Component</div>;
      case "analytics":
        return <div className="text-green-800">Analytics Component</div>;
      case "shipping":
        return <div className="text-green-800">Shipping Component</div>;
      default:
        return <div className="text-green-800">Coming Soon</div>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 text-center">KisanMitra Product Haven</h1>
          <p className="text-green-600 text-center mb-8">Connect farmers and buyers with quality agricultural products</p>
          <NavigationBar activeView={activeView} setActiveView={setActiveView} />
        </header>
        {renderActiveView()}
      </div>
    </div>
  );
};

export default Product;