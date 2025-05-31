import { useState } from "react";
import { MessageSquare, Star } from "lucide-react";
import { Button } from "../ui/button";

const ProductReviews = ({ 
  reviews, 
  averageRating, 
  onSubmitReview 
}) => {
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(0);

  const handleSubmit = () => {
    const trimmedReview = reviewText.trim();
    if (rating > 0 && trimmedReview.length > 0) {
      onSubmitReview(rating, trimmedReview);
      setRating(0);
      setReviewText("");
    }
  };

  return (
    <div className="mt-8 border border-green-200 rounded-lg">
      <div className="bg-gradient-to-r from-green-100 to-emerald-50 p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold text-green-800 flex items-center">
          <MessageSquare className="h-5 w-5 text-green-600 mr-2" />
          Ratings & Reviews
        </h2>
      </div>
      
      <div className="p-4">
        {/* Always show the review form */}
        <div className="mb-6 p-4 border border-green-100 rounded-lg bg-green-50">
          <h3 className="text-green-800 font-medium mb-2">Write a Review</h3>
          
          <div className="flex mb-3">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                className="focus:outline-none"
                aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
              >
                <Star 
                  className={`h-6 w-6 cursor-pointer ${
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
            aria-describedby="charCount"
          />
          <div 
            id="charCount" 
            className="text-xs text-gray-500 text-right" 
            aria-live="polite"
          >
            {reviewText.length}/500 characters
          </div>
          
          <Button 
            onClick={handleSubmit}
            disabled={rating === 0 || reviewText.trim().length === 0}
            className="mt-3 bg-green-600 hover:bg-green-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Submit Review
          </Button>
        </div>
        
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
      </div>
    </div>
  );
};

export default ProductReviews;
