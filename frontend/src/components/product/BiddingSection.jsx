import { useState } from "react";
import { Users, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Input from "../ui/Input";

const BiddingSection = ({ 
  product, 
  userBid, 
  otherBids, 
  onPlaceBid, 
  placingBid, 
  error 
}) => {
  const [bidAmount, setBidAmount] = useState("");
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="border-green-200 mt-6">
      <div className="bg-green-50 p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold text-green-800 flex items-center">
          <Users className="h-5 w-5 text-green-600 mr-2" />
          Bidding Enabled
        </h2>
        <p className="text-green-700 text-sm">
          Minimum Bid Amount: <span className="font-semibold">₹{product.minimumBidAmount.toFixed(2)}</span>
        </p>
      </div>
      
      <div className="space-y-4 p-4">
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
            onClick={() => onPlaceBid(bidAmount, quantity)}
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
      </div>
    </div>
  );
};

export default BiddingSection;