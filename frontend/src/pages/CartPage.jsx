import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
import {
  ShoppingCart,
  Trash2,
  Plus,
  Minus,
  ArrowLeft,
  Loader2,
  Check,
  Image as ImageIcon
} from 'lucide-react';
import { Button } from '../components/ui/button';

axios.defaults.withCredentials = true;

const CartPage = () => {
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [removing, setRemoving] = useState(null);
  const [error, setError] = useState('');
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const navigate = useNavigate();

  const token = Cookies.get('token');

  useEffect(() => {
    const fetchCart = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${backendUrl}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCart(response.data || { items: [], total: 0 });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load cart');
        setCart({ items: [], total: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [token]);

  const updateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    
    try {
      setUpdating(itemId);
      
      const currentCart = await axios.get(`${backendUrl}/api/cart`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const currentItem = currentCart.data.items.find(item => item._id === itemId);
      if (!currentItem) {
        throw new Error('Item not found in cart');
      }
      
      if (newQuantity > currentItem.productId.stock) {
        throw new Error(`Only ${currentItem.productId.stock} items available`);
      }

      const response = await axios.put(
        `${backendUrl}/api/cart/update/${itemId}`,
        { quantity: newQuantity },
        { 
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true
        }
      );
      
      setCart(response.data);
      setError('');
      
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Failed to update quantity');
    } finally {
      setUpdating(false);
    }
  };

  const removeItem = async (itemId) => {
    try {
      setRemoving(itemId);
      const response = await axios.delete(
        `${backendUrl}/api/cart/remove/${itemId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to remove item');
    } finally {
      setRemoving(false);
    }
  };

  const clearCart = async () => {
    try {
      setLoading(true);
      const response = await axios.delete(
        `${backendUrl}/api/cart/clear`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCart(response.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to clear cart');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckout = async () => {
    try {
      setCheckoutLoading(true);
      navigate('/checkout');
    } catch (err) {
      setError(err.response?.data?.message || 'Checkout failed');
    } finally {
      setCheckoutLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        <span className="ml-2 text-green-800">Loading your cart...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate(-1)}
            className="text-green-700 hover:text-green-800"
          >
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Button>
          <h1 className="text-2xl font-bold text-green-800 ml-4">
            <ShoppingCart className="inline mr-2 h-6 w-6" />
            Your Shopping Cart
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        {cart.items.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <ShoppingCart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
            <p className="text-gray-500 mb-6">
              Looks like you haven't added any items to your cart yet.
            </p>
            <Button
              onClick={() => navigate('/display')}
              className="bg-green-600 hover:bg-green-700"
            >
              Continue Shopping
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="divide-y divide-gray-200">
                  {cart.items.map((item) => {
                    const product = item.productId || {};
                    return (
                      <div key={item._id} className="p-4">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 h-24 w-24 rounded-md overflow-hidden border border-gray-200 bg-gray-100 flex items-center justify-center">
                            {product.images?.[0] ? (
                              <img
                                src={product.images[0]}
                                alt={product.name || 'Product'}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <ImageIcon className="h-6 w-6 text-gray-400" />
                            )}
                          </div>
                          <div className="ml-4 flex-1">
                            <div className="flex justify-between">
                              <div>
                                <h3 className="text-lg font-medium text-gray-800">
                                  {product.name || 'Unknown Product'}
                                </h3>
                                <p className="text-sm text-gray-500 mt-1">
                                  {product.category || 'No category'}
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                  ₹{item.price?.toFixed(2) || '0.00'} each
                                </p>
                              </div>
                              <p className="text-lg font-semibold text-green-700">
                                ₹{(item.price * item.quantity).toFixed(2)}
                              </p>
                            </div>
                            <div className="flex justify-between items-center mt-4">
                              <div>
                                <div className="flex items-center">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item._id, item.quantity - 1)}
                                    disabled={updating === item._id || item.quantity <= 1}
                                    className={`h-8 w-8 p-0 ${
                                      updating === item._id || item.quantity <= 1 
                                        ? 'text-gray-400 cursor-not-allowed' 
                                        : 'text-green-700 hover:bg-green-50'
                                    }`}
                                  >
                                    {updating === item._id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Minus className="h-4 w-4" />
                                    )}
                                  </Button>
                                  <span className="mx-4 text-gray-700">
                                    {item.quantity}
                                  </span>
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => updateQuantity(item._id, item.quantity + 1)}
                                    disabled={
                                      updating === item._id || 
                                      (item.productId && item.quantity >= item.productId.stock)
                                    }
                                    className={`h-8 w-8 p-0 ${
                                      updating === item._id || (item.productId && item.quantity >= item.productId.stock)
                                        ? 'text-gray-400 cursor-not-allowed' 
                                        : 'text-green-700 hover:bg-green-50'
                                    }`}
                                  >
                                    {updating === item._id ? (
                                      <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                      <Plus className="h-4 w-4" />
                                    )}
                                  </Button>
                                </div>
                                {item.productId?.stock && (
                                  <div className="mt-1 text-xs text-gray-500">
                                    {item.quantity >= item.productId.stock ? (
                                      <span className="text-red-500">Maximum quantity reached ({item.productId.stock} available)</span>
                                    ) : (
                                      <span>{item.productId.stock - item.quantity} more available</span>
                                    )}
                                  </div>
                                )}
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeItem(item._id)}
                                disabled={removing === item._id}
                                className="text-red-600 hover:text-red-800"
                              >
                                {removing === item._id ? (
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                  <Trash2 className="h-4 w-4" />
                                )}
                                <span className="ml-2">Remove</span>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="border-t border-gray-200 p-4">
                  <Button
                    variant="ghost"
                    onClick={clearCart}
                    disabled={loading}
                    className="text-red-600 hover:text-red-800"
                  >
                    {loading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <Trash2 className="h-4 w-4 mr-2" />
                    )}
                    Clear Cart
                  </Button>
                </div>
              </div>
            </div>

            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  Order Summary
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">
                      ₹{cart.total?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">Free</span>
                  </div>
                  <div className="border-t border-gray-200 pt-4 flex justify-between">
                    <span className="text-lg font-semibold">Total</span>
                    <span className="text-lg font-semibold text-green-700">
                      ₹{cart.total?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </div>
                <Button
                  onClick={handleCheckout}
                  disabled={checkoutLoading || cart.items.length === 0}
                  className="w-full mt-6 bg-green-600 hover:bg-green-700"
                >
                  {checkoutLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Check className="h-4 w-4 mr-2" />
                      Proceed to Checkout
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;