import { useState } from "react";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "../ui/button";
import Input from "../ui/Input";

const BuyNowSection = ({ 
  product, 
  onPlaceOrder, 
  onAddToCart,
  placingOrder,
  addingToCart 
}) => {
  const [orderQuantity, setOrderQuantity] = useState(1);

  return (
    <div className="border-green-200 mt-6">
      <div className="bg-green-50 pb-2 p-4 rounded-t-lg">
        <h2 className="text-xl font-semibold text-green-800 flex items-center">
          <ShoppingCart className="h-5 w-5 text-green-600 mr-2" />
          Purchase Options
        </h2>
      </div>
      
      <div className="space-y-4 p-4">
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
        
        <div className="grid grid-cols-2 gap-4">
          <Button 
            onClick={() => onAddToCart(orderQuantity)}
            disabled={addingToCart || product.stock === 0} 
            className="w-full bg-amber-600 hover:bg-amber-700 transition-colors"
          >
            {addingToCart ? (
              <>
                <Loader2 size={16} className="mr-2 animate-spin" />
                Adding...
              </>
            ) : product.stock === 0 ? (
              "Out of Stock"
            ) : (
              "Add to Cart"
            )}
          </Button>
          
          <Button 
            onClick={() => onPlaceOrder(orderQuantity)}
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
              "Place Order"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default BuyNowSection;