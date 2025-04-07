import { useState } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Loader2, Leaf, Tractor, ShoppingBasket, TreePine } from "lucide-react";
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
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState("");

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      // If more than 5 files are selected, show an error
      if (files.length > 5) {
        setImageError("You can upload a maximum of 5 images.");
        return;
      } else {
        setImageError(""); // Clear error if under 5 files
        setFormData((prev) => ({
          ...prev,
          images: [...prev.images, ...Array.from(files)], // Append the new files
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }
  };

  // Remove selected image
  const removeImage = (index) => {
    setFormData((prev) => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: updatedImages };
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const productData = new FormData();
    for (const key in formData) {
      if (key === "images") {
        formData.images.forEach((image) =>
          productData.append("images", image)
        );
      } else {
        productData.append(key, formData[key]);
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

      // Reset the form data after successful submission
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

  // Render active view (add product form)
  const renderActiveView = () => {
    switch (activeView) {
      case "addProduct":
        return (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Form Section */}
            <div className="bg-white rounded-lg border border-green-100 shadow-sm overflow-hidden mt-6">
              <div className="bg-gradient-to-r from-green-100 to-emerald-50 p-6">
                <h2 className="text-2xl font-bold text-green-800">
                  Add New Product
                </h2>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Product Name"
                  className="border p-2 w-full"
                />

                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                  placeholder="Product Description"
                  className="border p-2 w-full min-h-[100px]"
                />

                <input
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  required
                  min="0"
                  placeholder="Price"
                  className="border p-2 w-full"
                />

                <input
                  name="stock"
                  type="number"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                  min="1"
                  placeholder="Stock"
                  className="border p-2 w-full"
                />

                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="border p-2 w-full"
                >
                  <option value="crop">Crop</option>
                  <option value="fertilizer">Fertilizer</option>
                  <option value="equipment">Equipment</option>
                  <option value="others">Others</option>
                </select>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isBiddingEnabled"
                    checked={formData.isBiddingEnabled}
                    onChange={handleChange}
                  />
                  <label>Enable Bidding</label>
                </div>

                {formData.isBiddingEnabled && (
                  <input
                    name="minimumBidAmount"
                    type="number"
                    value={formData.minimumBidAmount}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Minimum Bid Amount"
                    className="border p-2 w-full"
                  />
                )}

                <input
                  type="file"
                  name="images"
                  onChange={handleChange}
                  multiple // Allows multiple file selection
                  accept="image/*"
                  className="border p-2 w-full"
                />

                {/* Display error message if more than 5 images are selected */}
                {imageError && (
                  <p className="text-red-500 text-sm mt-2">{imageError}</p>
                )}

                {/* Image Preview Section */}
                <div className="mt-4 flex flex-wrap gap-4">
                  {formData.images.map((image, index) => (
                    <div key={index} className="relative">
                      <img
                        src={URL.createObjectURL(image)}
                        alt="Preview"
                        className="w-20 h-20 object-cover rounded"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="absolute top-0 right-0 text-red-500 text-xl"
                      >
                        &times;
                      </button>
                    </div>
                  ))}
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

            {/* Right Section - Info */}
            <div className="bg-white rounded-lg border border-green-100 shadow-sm overflow-hidden mt-6 p-6">
              <h2 className="text-2xl font-bold text-green-800 mb-4">
                Why Sell With KisanMitra?
              </h2>

              <div className="space-y-4 text-green-700">
                <div className="flex items-start gap-3">
                  <Leaf className="text-green-500" />
                  <p>
                    Reach a wide network of buyers looking for quality farm
                    produce, fertilizers, and equipment.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <Tractor className="text-green-500" />
                  <p>
                    Empower farmers by enabling fair bidding for your products.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <ShoppingBasket className="text-green-500" />
                  <p>
                    Manage your stock effortlessly and showcase your products
                    with multiple images.
                  </p>
                </div>

                <div className="flex items-start gap-3">
                  <TreePine className="text-green-500" />
                  <p>
                    Support sustainable farming practices by connecting directly
                    with consumers.
                  </p>
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <div className="text-green-800">Coming Soon</div>;
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <h1 className="text-4xl font-bold text-green-800 text-center">
            KisanMitra Product Haven
          </h1>
          <p className="text-green-600 text-center mb-8">
            Connect farmers and buyers with quality agricultural products
          </p>
          <NavigationBar
            activeView={activeView}
            setActiveView={setActiveView}
          />
        </header>
        {renderActiveView()}
      </div>
    </div>
  );
};

export default Product;
