import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Loader2, ArrowLeft, MapPin } from 'lucide-react';
import { Button } from '../components/ui/button';
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
axios.defaults.withCredentials = true;

const CheckoutPage = () => {
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const token = Cookies.get('token');

  const [cart, setCart] = useState(location.state?.cart || { items: [], total: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (!location.state?.cart) {
          const cartResponse = await axios.get(`${backendUrl}/api/cart`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setCart(cartResponse.data);
        }
      } catch (err) {
        console.error(err);  // Log the full error for debugging
        setError(err.response?.data?.message || 'Failed to load checkout data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, location.state]);

  const handleProceedToPayment = () => {
    const isComplete = Object.values(address).every(val => val.trim() !== '');
    if (!isComplete) {
      setError('Please fill out all address fields before continuing.');
      return;
    }

    navigate('/payment', {
      state: {
        cartItems: cart.items,
        total: cart.total,
        address,
      }
    });
  };

  if (cart.items.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-700">
        Your cart is empty. Please add items to proceed.
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 text-green-600 animate-spin" />
        <span className="ml-2 text-green-800">Loading checkout...</span>
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
            <ArrowLeft className="h-4 w-4 mr-1" /> Back to Cart
          </Button>
          <h1 className="text-2xl font-bold text-green-800 ml-4">
            Checkout
          </h1>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            {/* Address */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                <MapPin className="h-5 w-5 mr-2 text-green-600" />
                Shipping Address
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { name: 'name', label: 'Full Name' },
                  { name: 'phone', label: 'Phone Number' },
                  { name: 'street', label: 'Street Address' },
                  { name: 'city', label: 'City' },
                  { name: 'state', label: 'State' },
                  { name: 'pincode', label: 'Postal Code' }
                ].map((field) => (
                  <div key={field.name}>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      name={field.name}
                      value={address[field.name]}
                      onChange={(e) => setAddress({ ...address, [field.name]: e.target.value })}
                      required
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="divide-y divide-gray-200">
                {cart.items.map((item) => {
                  const product = item.productId || {};
                  return (
                    <div key={item._id} className="py-4 flex justify-between">
                      <div className="flex items-center">
                        <div className="h-16 w-16 rounded-md overflow-hidden border border-gray-200 bg-gray-100 mr-4">
                          {product.images?.[0] && (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{product.name}</p>
                          <p className="text-sm text-gray-500">
                            {item.quantity} × ₹{item.price?.toFixed(2)}
                          </p>
                        </div>
                      </div>
                      <p className="font-medium">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-gray-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>₹{cart.total?.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between font-semibold text-lg pt-2">
                  <span>Total</span>
                  <span className="text-green-700">₹{cart.total?.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right side card */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-4 space-y-4">
              <h2 className="text-lg font-semibold text-gray-800">
                Ready to proceed?
              </h2>
              <p className="text-sm text-gray-500">
                Please confirm your address and review your order before proceeding.
              </p>
              <Button
                onClick={handleProceedToPayment}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold"
              >
                Proceed to Payment
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;
