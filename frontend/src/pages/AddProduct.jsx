import { useState, useEffect } from "react";
import axios from "axios";
import { Button } from "../components/ui/button";
import { Loader2, Leaf, Tractor, ShoppingBasket, TreePine, Calendar, Clock, CheckCircle } from "lucide-react";
import { cn } from "../lib/utils";
import NavigationBar from "../components/NavigationBar";

const AddProduct = () => {
  const [activeView, setActiveView] = useState("addProduct");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "crop",
    stock: "1",
    isBiddingEnabled: false,
    minimumBidAmount: "",
    biddingStartDate: "",
    biddingEndDate: "",
    images: [],
  });

  const [loading, setLoading] = useState(false);
  const [imageError, setImageError] = useState("");
  const [formErrors, setFormErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");

  // Reset bidding fields when bidding is disabled
  useEffect(() => {
    if (!formData.isBiddingEnabled) {
      setFormData(prev => ({
        ...prev,
        minimumBidAmount: "",
        biddingStartDate: "",
        biddingEndDate: ""
      }));
    } else {
      // Set default start date to now if not set
      if (!formData.biddingStartDate) {
        const now = new Date();
        const defaultStartDate = now.toISOString().slice(0, 16);
        setFormData(prev => ({
          ...prev,
          biddingStartDate: defaultStartDate
        }));
      }
    }
  }, [formData.isBiddingEnabled]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    if (type === "file") {
      if (files.length > 5) {
        setImageError("You can upload a maximum of 5 images.");
        return;
      }
      
      // Clear previous images and add new ones
      setImageError("");
      setFormData(prev => ({
        ...prev,
        images: Array.from(files), // Replace existing images with new selection
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === "checkbox" ? checked : value,
      }));
    }

    // Clear error when field changes
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  // Remove selected image
  const removeImage = (index) => {
    setFormData(prev => {
      const updatedImages = prev.images.filter((_, i) => i !== index);
      return { ...prev, images: updatedImages };
    });
  };

  // Validate form data
  const validateForm = () => {
    const errors = {};

    if (!formData.name.trim()) errors.name = "Product name is required";
    if (!formData.description.trim()) errors.description = "Description is required";
    if (!formData.category) errors.category = "Category is required";
    if (formData.stock < 1) errors.stock = "Stock must be at least 1";

    if (formData.isBiddingEnabled) {
      if (!formData.minimumBidAmount || formData.minimumBidAmount <= 0) {
        errors.minimumBidAmount = "Minimum bid amount must be positive";
      }
      if (!formData.biddingEndDate) {
        errors.biddingEndDate = "Bidding end date is required";
      } else if (new Date(formData.biddingEndDate) <= new Date()) {
        errors.biddingEndDate = "End date must be in the future";
      }
      if (formData.biddingStartDate && 
          new Date(formData.biddingStartDate) >= new Date(formData.biddingEndDate)) {
        errors.biddingStartDate = "Start date must be before end date";
      }
    } else {
      if (!formData.price || formData.price <= 0) {
        errors.price = "Price must be positive";
      }
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage("");
    setFormErrors({});

    if (!validateForm()) {
      setLoading(false);
      return;
    }

    const productData = new FormData();
    const productFields = {
      name: formData.name,
      description: formData.description,
      category: formData.category,
      stock: formData.stock,
      isBiddingEnabled: formData.isBiddingEnabled,
    };

    // Add fields based on bidding status
    if (formData.isBiddingEnabled) {
      productFields.minimumBidAmount = formData.minimumBidAmount;
      productFields.biddingStartDate = formData.biddingStartDate || new Date();
      productFields.biddingEndDate = formData.biddingEndDate;
    } else {
      productFields.price = formData.price;
    }

    // Append all fields to FormData
    Object.entries(productFields).forEach(([key, value]) => {
      productData.append(key, value);
    });

    // Append images
    formData.images.forEach(image => {
      productData.append("images", image);
    });

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

      // Reset form after successful submission
      setFormData({
        name: "",
        description: "",
        price: "",
        category: "crop",
        stock: "1",
        isBiddingEnabled: false,
        minimumBidAmount: "",
        biddingStartDate: "",
        biddingEndDate: "",
        images: [],
      });
      
      setSuccessMessage("Product added successfully!");
    } catch (error) {
      console.error("Error adding product", error);
      if (error.response?.data?.message) {
        setFormErrors({ submit: error.response.data.message });
      } else {
        setFormErrors({ submit: "Failed to add product. Please try again." });
      }
    } finally {
      setLoading(false);
    }
  };

  // Render active view
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
                {/* Success Message */}
                {successMessage && (
                  <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-md flex items-center">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    <span>{successMessage}</span>
                  </div>
                )}

                {/* Product Name */}
                <div>
                  <input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    placeholder="Product Name"
                    className={`border p-2 w-full ${formErrors.name ? "border-red-500" : ""}`}
                  />
                  {formErrors.name && <p className="text-red-500 text-sm mt-1">{formErrors.name}</p>}
                </div>

                {/* Description */}
                <div>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    placeholder="Product Description"
                    className={`border p-2 w-full min-h-[100px] ${formErrors.description ? "border-red-500" : ""}`}
                  />
                  {formErrors.description && <p className="text-red-500 text-sm mt-1">{formErrors.description}</p>}
                </div>

                {/* Price (shown when bidding is disabled) */}
                {!formData.isBiddingEnabled && (
                  <div>
                    <input
                      name="price"
                      type="number"
                      value={formData.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      placeholder="Price"
                      className={`border p-2 w-full ${formErrors.price ? "border-red-500" : ""}`}
                    />
                    {formErrors.price && <p className="text-red-500 text-sm mt-1">{formErrors.price}</p>}
                  </div>
                )}

                {/* Stock */}
                <div>
                  <input
                    name="stock"
                    type="number"
                    value={formData.stock}
                    onChange={handleChange}
                    required
                    min="1"
                    placeholder="Stock Quantity"
                    className={`border p-2 w-full ${formErrors.stock ? "border-red-500" : ""}`}
                  />
                  {formErrors.stock && <p className="text-red-500 text-sm mt-1">{formErrors.stock}</p>}
                </div>

                {/* Category */}
                <div>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="border p-2 w-full"
                  >
                    <option value="crop">Crop</option>
                    <option value="fertilizer">Fertilizer</option>
                    <option value="equipment">Equipment</option>
                  </select>
                </div>

                {/* Bidding Toggle */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    name="isBiddingEnabled"
                    id="isBiddingEnabled"
                    checked={formData.isBiddingEnabled}
                    onChange={handleChange}
                    className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                  />
                  <label htmlFor="isBiddingEnabled" className="text-gray-700">
                    Enable Bidding
                  </label>
                </div>

                {/* Bidding Fields (shown when enabled) */}
                {formData.isBiddingEnabled && (
                  <div className="space-y-4 border-t pt-4">
                    {/* Minimum Bid Amount */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Bid Amount
                      </label>
                      <input
                        name="minimumBidAmount"
                        type="number"
                        value={formData.minimumBidAmount}
                        onChange={handleChange}
                        required
                        min="0.01"
                        step="0.01"
                        placeholder="Minimum bid amount"
                        className={`border p-2 w-full ${formErrors.minimumBidAmount ? "border-red-500" : ""}`}
                      />
                      {formErrors.minimumBidAmount && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.minimumBidAmount}</p>
                      )}
                    </div>

                    {/* Bidding Start Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bidding Start Date
                      </label>
                      <div className="relative">
                        <input
                          name="biddingStartDate"
                          type="datetime-local"
                          value={formData.biddingStartDate}
                          onChange={handleChange}
                          className={`border p-2 w-full ${formErrors.biddingStartDate ? "border-red-500" : ""}`}
                        />
                        <Calendar className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      </div>
                      {formErrors.biddingStartDate && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.biddingStartDate}</p>
                      )}
                    </div>

                    {/* Bidding End Date */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Bidding End Date
                      </label>
                      <div className="relative">
                        <input
                          name="biddingEndDate"
                          type="datetime-local"
                          value={formData.biddingEndDate}
                          onChange={handleChange}
                          required
                          min={formData.biddingStartDate || new Date().toISOString().slice(0, 16)}
                          className={`border p-2 w-full ${formErrors.biddingEndDate ? "border-red-500" : ""}`}
                        />
                        <Clock className="absolute right-3 top-3 h-4 w-4 text-gray-400" />
                      </div>
                      {formErrors.biddingEndDate && (
                        <p className="text-red-500 text-sm mt-1">{formErrors.biddingEndDate}</p>
                      )}
                    </div>
                  </div>
                )}

                {/* Image Upload */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Product Images (Max 5)
                  </label>
                  <input
                    type="file"
                    name="images"
                    onChange={handleChange}
                    multiple
                    accept="image/*"
                    className="border p-2 w-full"
                  />
                  {imageError && <p className="text-red-500 text-sm mt-2">{imageError}</p>}

                  {/* Image Previews */}
                  <div className="mt-4 flex flex-wrap gap-4">
                    {formData.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={URL.createObjectURL(image)}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded border"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          &times;
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit Button */}
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

                {/* Submission error */}
                {formErrors.submit && (
                  <p className="text-red-500 text-sm mt-2 text-center">
                    {formErrors.submit}
                  </p>
                )}
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

export default AddProduct;