import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Button } from "../components/ui/button";
import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { 
  Loader2, 
  ArrowLeft, 
  Star, 
  ShoppingCart, 
  Tag, 
  Package, 
  MessageSquare,
  Users,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  X
} from "lucide-react";
import Cookies from "js-cookie";

const Input = React.forwardRef(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={`
        flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background 
        file:border-0 file:bg-transparent file:text-sm file:font-medium 
        placeholder:text-muted-foreground 
        focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 
        disabled:cursor-not-allowed disabled:opacity-50
        ${className}
      `}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bidAmount, setBidAmount] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [placingBid, setPlacingBid] = useState(false);
  const [orderQuantity, setOrderQuantity] = useState(1);
  const [placingOrder, setPlacingOrder] = useState(false);
  const [activeImage, setActiveImage] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);
  const [imageViewerOpen, setImageViewerOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [userHasOrdered, setUserHasOrdered] = useState(false);
  const [showAllThumbnails, setShowAllThumbnails] = useState(false);

  const token = Cookies.get("token");
  axios.defaults.withCredentials = true;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:5000/api/products/getProduct/${id}`,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        setProduct(response.data);
        
        const orderCheck = await axios.get(
          `http://localhost:5000/api/orders/hasOrdered/${id}`,
          { 
            headers: { 
              Authorization: `Bearer ${token}`,
            },
            withCredentials: true
          }
        );
        setUserHasOrdered(orderCheck.data.hasOrdered);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError(error.response?.data?.message || "Failed to fetch product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id, token, navigate]);

  const handlePlaceBid = async () => {
    if (!bidAmount || isNaN(bidAmount)) {
      setError("Please enter a valid bid amount");
      return;
    }

    const bidValue = parseFloat(bidAmount);
    if (bidValue < (product?.minimumBidAmount || 0)) {
      setError(`Bid amount must be at least ₹${product?.minimumBidAmount}`);
      return;
    }

    setError("");
    setPlacingBid(true);

    try {
      const response = await axios.post(
        `http://localhost:5000/api/products/placeBid/${id}`,
        { bidAmount: bidValue, quantity },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );

      setProduct(response.data.product);
      setBidAmount("");
      setQuantity(1);
      setError("Bid placed successfully!");
    } catch (error) {
      setError(error.response?.data?.message || "Error placing bid");
    } finally {
      setPlacingBid(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (orderQuantity > product?.stock) {
      setError(`Only ${product?.stock} items available`);
      return;
    }

    setPlacingOrder(true);
    setError("");
    
    try {
      await axios.post(
        `http://localhost:5000/api/orders/place`,
        { 
          productId: id,
          quantity: orderQuantity,
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );
      
      const response = await axios.get(
        `http://localhost:5000/api/products/getProduct/${id}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );
      setProduct(response.data);
      setError("Order placed successfully!");
      setUserHasOrdered(true);
    } catch (error) {
      setError(error.response?.data?.message || "Error placing order");
    } finally {
      setPlacingOrder(false);
    }
  };

  const handleSubmitReview = async () => {
    if (rating === 0) {
      setError("Please select a rating before submitting your review.");
      return;
    }

    if (!reviewText.trim()) {
      setError("Please write your review before submitting.");
      return;
    }

    try {
      await axios.post(
        `http://localhost:5000/api/products/${id}/review`,
        { 
          rating,
          comment: reviewText.trim()
        },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );
      
      setReviewText("");
      setRating(0);
      setError("Review submitted successfully!");
      
      const response = await axios.get(
        `http://localhost:5000/api/products/getProduct/${id}`,
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true
        }
      );
      setProduct(response.data);
    } catch (error) {
      setError(error.response?.data?.message || "Error submitting review");
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case "crop":
        return <span className="text-green-600 font-medium">Crop</span>;
      case "fertilizer":
        return <span className="text-amber-600 font-medium">Fertilizer</span>;
      case "equipment":
        return <span className="text-blue-600 font-medium">Equipment</span>;
      default:
        return <span className="text-gray-600 font-medium">Other</span>;
    }
  };

  const openImageModal = (index) => {
    if (!product?.images) return;
    setSelectedImageIndex(index);
    setImageViewerOpen(true);
  };

  const closeImageModal = () => {
    setImageViewerOpen(false);
  };

  const navigateImage = (direction) => {
    if (!product?.images) return;
    setSelectedImageIndex(prev => {
      if (direction === 'prev') {
        return prev === 0 ? product.images.length - 1 : prev - 1;
      } else {
        return prev === product.images.length - 1 ? 0 : prev + 1;
      }
    });
  };

  if (loading || !product) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        <span className="ml-2 text-green-800">Loading product details...</span>
      </div>
    );
  }

  const userBid = product.bids?.find((bid) => bid.userId === Cookies.get("userId"));
  const otherBids = product.bids?.filter((bid) => bid.userId !== Cookies.get("userId")) || [];
  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length 
    : 0;

  // Enhanced thumbnail display logic
  const displayedThumbnails = showAllThumbnails 
    ? product.images 
    : product.images.slice(0, 5);
  const hasMoreThumbnails = product.images.length > 5;

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-green-50 to-white">
      <div className="container mx-auto px-4 py-8">
        <Link to="/display" className="inline-flex items-center text-green-700 hover:text-green-800 mb-6">
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to products
        </Link>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

<div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Product Images Column - Fixed Section */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-lg border border-green-100 shadow-sm overflow-hidden">
              {product?.images?.length > 0 ? (
                <div>
                  {/* Main Image Display */}
                  <div 
                    className="h-80 w-full bg-white flex items-center justify-center"
                    onClick={() => openImageModal(activeImage)}
                  >
                    <img 
                      src={product.images[activeImage]} 
                      alt={product.name}
                      className="max-h-full max-w-full object-contain"
                      style={{ backgroundColor: 'white' }}
                    />
                  </div>
                  
                  {/* Thumbnail Navigation */}
                  {product.images.length > 1 && (
                    <div className="p-2 bg-white border-t border-gray-100">
                      <div className="flex flex-wrap gap-2">
                        {displayedThumbnails.map((image, index) => (
                          <button
                            key={index}
                            onClick={() => setActiveImage(index)}
                            className={`w-16 h-16 rounded border-2 flex-shrink-0 overflow-hidden ${
                              index === activeImage 
                                ? 'border-green-600 ring-2 ring-green-400' 
                                : 'border-gray-200 hover:border-green-400'
                            }`}
                            style={{ backgroundColor: 'white' }}
                          >
                            <img
                              src={image}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                              style={{ backgroundColor: 'white' }}
                            />
                          </button>
                        ))}
                        
                        {hasMoreThumbnails && !showAllThumbnails && (
                          <button
                            onClick={() => setShowAllThumbnails(true)}
                            className="w-16 h-16 rounded border-2 border-dashed border-gray-300 flex items-center justify-center text-gray-500 hover:border-green-400 hover:text-green-600"
                            style={{ backgroundColor: 'white' }}
                          >
                            +{product.images.length - 5}
                          </button>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="h-80 bg-gray-100 flex items-center justify-center text-gray-400">
                  <span>No Image Available</span>
                </div>
              )}
            </div>
          </div>
          {/* Product Details Column */}
          <div className="lg:col-span-7">
            <Card>
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-50">
                <CardTitle className="text-2xl font-bold text-green-800">{product.name}</CardTitle>
                <div className="flex items-center mt-2">
                  <Tag className="h-4 w-4 text-green-600 mr-1" />
                  <span className="text-sm text-green-700">Category: {getCategoryIcon(product.category)}</span>
                </div>
                {reviews.length > 0 && (
                  <div className="flex items-center mt-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star 
                          key={star}
                          className={`h-4 w-4 ${
                            star <= Math.round(averageRating) 
                              ? 'text-yellow-500 fill-yellow-500' 
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-green-700 ml-2">
                      {averageRating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                )}
              </CardHeader>
              
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-lg font-semibold text-green-800">Description</h3>
                    <p className="text-gray-700 mt-1">{product.description}</p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-green-700">Price</h4>
                      <p className="text-2xl font-bold text-green-800">₹{product.price.toFixed(2)}</p>
                    </div>
                    
                    <div className="bg-green-50 p-3 rounded-lg">
                      <h4 className="text-sm font-medium text-green-700">Stock</h4>
                      <div className="flex items-center">
                        <Package className="h-5 w-5 text-green-600 mr-1" />
                        <p className="text-2xl font-bold text-green-800">{product.stock}</p>
                      </div>
                    </div>
                  </div>
                  
                  {!product.isBiddingEnabled && (
                    <Card className="border-green-200 mt-6">
                      <CardHeader className="bg-green-50 pb-2">
                        <CardTitle className="text-xl font-semibold text-green-800 flex items-center">
                          <ShoppingCart className="h-5 w-5 text-green-600 mr-2" />
                          Buy Now
                        </CardTitle>
                      </CardHeader>
                      
                      <CardContent className="space-y-4 pt-4">
                        <div className="flex items-center gap-4">
                          <div>
                            <label className="text-sm font-medium text-green-700 block mb-1">
                              Quantity
                            </label>
                            <div className="flex h-10 w-32">
                              <button 
                                onClick={() => setOrderQuantity(prev => Math.max(1, prev - 1))}
                                className="bg-green-100 rounded-l-md px-2 hover:bg-green-200 transition-colors"
                                disabled={orderQuantity <= 1}
                              >
                                -
                              </button>
                              <Input
                                type="number"
                                value={orderQuantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val) && val > 0 && val <= product.stock) {
                                    setOrderQuantity(val);
                                  }
                                }}
                                className="rounded-none text-center"
                                min="1"
                                max={product.stock}
                              />
                              <button 
                                onClick={() => setOrderQuantity(prev => Math.min(product.stock, prev + 1))}
                                className="bg-green-100 rounded-r-md px-2 hover:bg-green-200 transition-colors"
                                disabled={orderQuantity >= product.stock}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          <div className="flex-1">
                            <p className="text-sm font-medium text-green-700 mb-1">Total Price</p>
                            <p className="text-xl font-bold text-green-800">
                              ₹{(product.price * orderQuantity).toFixed(2)}
                            </p>
                          </div>
                        </div>
                        
                        <Button 
                          onClick={handlePlaceOrder}
                          disabled={placingOrder || product.stock === 0} 
                          className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                        >
                          {placingOrder ? (
                            <>
                              <Loader2 size={16} className="mr-2 animate-spin" />
                              Processing...
                            </>
                          ) : product.stock === 0 ? (
                            "Out of Stock"
                          ) : (
                            "Place Order Now"
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  )}

                  {product.isBiddingEnabled && (
                    <Card className="border-green-200 mt-6">
                      <CardHeader className="bg-green-50">
                        <CardTitle className="text-xl font-semibold text-green-800 flex items-center">
                          <Users className="h-5 w-5 text-green-600 mr-2" />
                          Bidding Enabled
                        </CardTitle>
                        <p className="text-green-700 text-sm">
                          Minimum Bid Amount: <span className="font-semibold">₹{product.minimumBidAmount.toFixed(2)}</span>
                        </p>
                      </CardHeader>
                      
                      <CardContent className="space-y-4 pt-4">
                        <div className="space-y-3">
                          <div>
                            <label className="text-sm font-medium text-green-700 block mb-1">
                              Your Bid Amount (₹)
                            </label>
                            <Input
                              type="number"
                              placeholder={`Minimum ₹${product.minimumBidAmount.toFixed(2)}`}
                              value={bidAmount}
                              onChange={(e) => setBidAmount(e.target.value)}
                              className="border-green-200 focus:border-green-400"
                              min={product.minimumBidAmount}
                              step="0.01"
                            />
                          </div>
                          
                          <div>
                            <label className="text-sm font-medium text-green-700 block mb-1">
                              Quantity
                            </label>
                            <div className="flex h-10 w-32">
                              <button 
                                onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                                className="bg-green-100 rounded-l-md px-2 hover:bg-green-200 transition-colors"
                                disabled={quantity <= 1}
                              >
                                -
                              </button>
                              <Input
                                type="number"
                                value={quantity}
                                onChange={(e) => {
                                  const val = parseInt(e.target.value);
                                  if (!isNaN(val) && val > 0 && val <= product.stock) {
                                    setQuantity(val);
                                  }
                                }}
                                className="rounded-none text-center"
                                min="1"
                                max={product.stock}
                              />
                              <button 
                                onClick={() => setQuantity(prev => Math.min(product.stock, prev + 1))}
                                className="bg-green-100 rounded-r-md px-2 hover:bg-green-200 transition-colors"
                                disabled={quantity >= product.stock}
                              >
                                +
                              </button>
                            </div>
                          </div>
                          
                          {error && (
                            <div className="bg-red-50 text-red-600 p-2 rounded text-sm">
                              {error}
                            </div>
                          )}
                          
                          <Button 
                            onClick={handlePlaceBid}
                            disabled={placingBid || product.stock === 0} 
                            className="w-full bg-green-600 hover:bg-green-700 transition-colors"
                          >
                            {placingBid ? (
                              <>
                                <Loader2 size={16} className="mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : product.stock === 0 ? (
                              "Out of Stock"
                            ) : userBid ? (
                              "Update Your Bid"
                            ) : (
                              "Place a Bid"
                            )}
                          </Button>
                        </div>
                        
                        {userBid && (
                          <div className="bg-blue-50 p-3 rounded-lg border border-blue-100">
                            <h3 className="text-md font-semibold text-blue-700">Your Current Bid</h3>
                            <p className="text-lg text-blue-800 font-bold">₹{userBid.bidAmount.toFixed(2)}</p>
                            <div className="flex justify-between text-sm">
                              <span className="text-blue-600">Quantity: {userBid.quantity}</span>
                              <span className="text-blue-600">
                                Updated: {new Date(userBid.updatedAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        )}
                        
                        {otherBids.length > 0 && (
                          <div className="mt-4">
                            <h3 className="text-md font-semibold text-green-700 mb-2">
                              Other Bids ({otherBids.length})
                            </h3>
                            <div className="bg-white rounded-lg border border-green-100 divide-y divide-green-100 max-h-60 overflow-y-auto">
                              {otherBids.map((bid, index) => (
                                <div key={index} className="p-3">
                                  <div className="flex justify-between">
                                    <span className="font-semibold text-green-800">₹{bid.bidAmount.toFixed(2)}</span>
                                    <span className="text-sm text-green-700">Qty: {bid.quantity}</span>
                                  </div>
                                  <p className="text-xs text-gray-500">
                                    {new Date(bid.createdAt).toLocaleDateString()}
                                  </p>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )}
                </div>
              </CardContent>
            </Card>
            
            {/* Reviews Section */}
            <Card className="mt-8 border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-100 to-emerald-50">
                <CardTitle className="text-xl font-semibold text-green-800 flex items-center">
                  <MessageSquare className="h-5 w-5 text-green-600 mr-2" />
                  Ratings & Reviews
                </CardTitle>
              </CardHeader>
              
              <CardContent className="pt-6">
                {userHasOrdered && (
                  <div className="mb-6 p-4 border border-green-100 rounded-lg bg-green-50">
                    <h3 className="text-green-800 font-medium mb-2">Write a Review</h3>
                    
                    <div className="flex mb-3">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setRating(star)}
                          className="focus:outline-none"
                          aria-label={`Rate ${star} star`}
                        >
                          <Star 
                            className={`h-6 w-6 ${
                              star <= rating 
                                ? 'text-yellow-500 fill-yellow-500' 
                                : 'text-gray-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                    
                    <textarea
                      value={reviewText}
                      onChange={(e) => setReviewText(e.target.value)}
                      placeholder="Share your experience with this product..."
                      className="w-full p-3 border border-green-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 min-h-[100px]"
                      maxLength={500}
                    />
                    <div className="text-xs text-gray-500 text-right">
                      {reviewText.length}/500 characters
                    </div>
                    
                    <Button 
                      onClick={handleSubmitReview}
                      className="mt-3 bg-green-600 hover:bg-green-700 transition-colors"
                    >
                      Submit Review
                    </Button>
                  </div>
                )}
                
                {reviews.length > 0 ? (
                  <div className="space-y-4">
                    {reviews.map((review, index) => (
                      <div key={index} className="border-b border-gray-100 pb-4 last:border-b-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-green-200 flex items-center justify-center text-green-800 font-medium">
                              {review.userName?.[0]?.toUpperCase() || "U"}
                            </div>
                            <span className="ml-2 font-medium">{review.userName || "User"}</span>
                          </div>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star}
                                className={`h-4 w-4 ${
                                  star <= review.rating 
                                    ? 'text-yellow-500 fill-yellow-500' 
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                        </div>
                        <p className="text-gray-700">{review.comment}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          {new Date(review.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    No reviews yet. Be the first to review this product!
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Enhanced Image Viewer Modal */}
      {imageViewerOpen && product?.images?.length > 0 && (
        <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
          <button 
            onClick={closeImageModal}
            className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
            aria-label="Close image viewer"
          >
            <X className="h-8 w-8" />
          </button>
          
          <button 
            onClick={() => navigateImage('prev')}
            className="absolute left-4 text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Previous image"
          >
            <ChevronLeft className="h-8 w-8" />
          </button>
          
          <div className="max-w-4xl w-full h-full flex items-center justify-center">
            <img 
              src={product.images[selectedImageIndex]} 
              alt={`Product view ${selectedImageIndex + 1}`}
              className="max-h-full max-w-full object-contain"
            />
          </div>
          
          <button 
            onClick={() => navigateImage('next')}
            className="absolute right-4 text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Next image"
          >
            <ChevronRight className="h-8 w-8" />
          </button>
          
          {/* Thumbnail strip at the bottom */}
          <div className="absolute bottom-4 left-0 right-0">
            <div className="container mx-auto px-4">
              <div className="flex overflow-x-auto space-x-2 py-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`flex-shrink-0 w-16 h-16 rounded border-2 transition-all ${
                      index === selectedImageIndex 
                        ? 'border-white ring-2 ring-white' 
                        : 'border-gray-500 hover:border-gray-300'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;