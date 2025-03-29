import React from 'react';
import { Star, ThumbsUp, Shield } from 'lucide-react';
import { Card, CardContent } from '../ui/card';


const ReviewSystem = () => {
  const reviews = [
    {
      item: "XYZ Brand Fertilizer",
      user: "Mohan Kumar",
      location: "Haryana",
      rating: 5,
      comment: "This fertilizer worked wonders for my wheat crop. Saw a 20% increase in yield compared to last season.",
      image: "https://images.unsplash.com/photo-1601304372221-48e7d8750919?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8ZmVydGlsaXplcnxlbnwwfHwwfHx8MA%3D%3D",
      verifiedPurchase: true
    },
    {
      item: "ABC Seeds",
      user: "Kavita Patel",
      location: "Gujarat",
      rating: 4,
      comment: "Good germination rate, around 85%. The plants are healthy but some seeds didn't sprout.",
      image: "https://images.unsplash.com/photo-1677136472306-5c4397f21d3e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c2VlZHN8ZW58MHx8MHx8fDA%3D",
      verifiedPurchase: true
    },
    {
      item: "Drip Irrigation System",
      user: "Suresh Singh",
      location: "Maharashtra",
      rating: 5,
      comment: "Best investment for my farm. Water usage down by 60% and crops are healthier. Installation guide was very helpful.",
      image: "https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NXx8ZHJpcCUyMGlycmlnYXRpb258ZW58MHx8MHx8fDA%3D",
      verifiedPurchase: false
    }
  ];

  return (
    <div className="py-16 border-t border-gray-100">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-amber-100 text-amber-800">
            <Star className="h-4 w-4 mr-2" />
            Review System
          </div>
          <h2 className="text-3xl font-bold tracking-tight text-gray-900">Trusted Product Reviews</h2>
          <p className="text-lg text-gray-600">
            Make informed decisions about agricultural inputs and equipment based on real reviews from other farmers. Share your own experiences to help the farming community.
          </p>
          <ul className="space-y-4">
            <li className="flex">
              <ThumbsUp className="h-6 w-6 text-amber-500 flex-shrink-0 mr-3" />
              <span>Verified purchase reviews for trustworthy information</span>
            </li>
            <li className="flex">
              <Shield className="h-6 w-6 text-amber-500 flex-shrink-0 mr-3" />
              <span>Protect yourself from low-quality products and services</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-6">
          {reviews.map((review, index) => (
            <Card key={index} className="overflow-hidden hover:shadow-md transition-all">
              <CardContent className="p-0">
                <div className="flex flex-col sm:flex-row">
                  <div className="sm:w-1/4">
                    <img 
                      src={review.image} 
                      alt={review.item} 
                      className="w-full h-32 sm:h-full object-cover"
                    />
                  </div>
                  <div className="p-4 sm:w-3/4">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-lg">{review.item}</h3>
                        <div className="flex items-center mt-1">
                          {[...Array(5)].map((_, i) => (
                            <Star 
                              key={i} 
                              className={`h-4 w-4 ${i < review.rating ? 'text-yellow-500 fill-current' : 'text-gray-300'}`} 
                            />
                          ))}
                        </div>
                      </div>
                      {review.verifiedPurchase && (
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Verified Purchase</span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mt-3">{review.comment}</p>
                    <div className="mt-3 text-sm text-gray-500">
                      By {review.user} from {review.location}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ReviewSystem;