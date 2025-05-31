import { useEffect, useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { Button } from '../components/ui/button'
import {
  Loader2,
  ArrowLeft,
  Star,
  ShoppingCart,
  Clock,
  CheckCircle,
  XCircle
} from 'lucide-react'
import Cookies from 'js-cookie'
import ProductImageGallery from '../components/product/ProductImageGallery'
import BuyNowSection from '../components/product/BuyNowSection'
import BiddingSection from '../components/product/BiddingSection'
import ProductReviews from '../components/product/ProductReviews'

const ProductDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [placingBid, setPlacingBid] = useState(false)
  const [placingOrder, setPlacingOrder] = useState(false)
  const [addingToCart, setAddingToCart] = useState(false)
  const [userHasOrdered, setUserHasOrdered] = useState(false)

  const token = Cookies.get('token')
  axios.defaults.withCredentials = true

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const response = await axios.get(
          `http://localhost:5000/api/products/getProduct/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`
            },
            withCredentials: true
          }
        )
        setProduct(response.data)

        if (token) {
          const orderCheck = await axios.get(
            `http://localhost:5000/api/orders/hasOrdered/${id}`,
            {
              headers: {
                Authorization: `Bearer ${token}`
              },
              withCredentials: true
            }
          )
          setUserHasOrdered(orderCheck.data.hasOrdered)
        }
      } catch (error) {
        console.error('Error fetching product details:', error)
        setError(
          error.response?.data?.message || 'Failed to fetch product details'
        )
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, token, navigate])

  const isBiddingEnded = product => {
    if (!product.isBiddingEnabled || !product.biddingEndDate) return false
    return new Date() > new Date(product.biddingEndDate)
  }

  const isProductSold = product => {
    return product.stock === 0
  }

  const handlePlaceBid = async (bidAmount, quantity) => {
    if (!product.isBiddingEnabled) {
      setError('Bidding is not enabled for this product')
      return
    }

    if (isBiddingEnded(product)) {
      setError('Bidding has ended for this product')
      return
    }

    const bidValue = parseFloat(bidAmount)
    if (isNaN(bidValue)) {
      setError('Please enter a valid bid amount')
      return
    }
    if (bidValue < product.minimumBidAmount) {
      setError(`Bid amount must be at least ₹${product.minimumBidAmount}`)
      return
    }
    if (quantity > product.stock) {
      setError(`Only ${product.stock} items available`)
      return
    }

    setError('')
    setPlacingBid(true)

    try {
      const response = await axios.post(
        `http://localhost:5000/api/products/placeBid/${id}/`,
        { bidAmount: bidValue, quantity },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      )

      setProduct(response.data.product)
      setError('Bid placed successfully!')
    } catch (error) {
      if (error.response?.data?.biddingEnded) {
        setError('Bidding has ended for this product')
      } else {
        setError(error.response?.data?.message || 'Error placing bid')
      }
    } finally {
      setPlacingBid(false)
    }
  }

  const handlePlaceOrder = async quantity => {
    if (product.isBiddingEnabled) {
      setError('This product is only available for bidding')
      return
    }
    if (quantity > product.stock) {
      setError(`Only ${product.stock} items available`)
      return
    }

    setPlacingOrder(true)
    setError('')

    try {
      await axios.post(
        `http://localhost:5000/api/orders`,
        {
          productId: id,
          quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      )

      const response = await axios.get(
        `http://localhost:5000/api/products/getProduct/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      )
      setProduct(response.data)
      setError('Order placed successfully!')
      setUserHasOrdered(true)
    } catch (error) {
      setError(error.response?.data?.message || 'Error placing order')
    } finally {
      setPlacingOrder(false)
    }
  }

  const handleAddToCart = async quantity => {
    if (product.isBiddingEnabled) {
      setError('Cannot add bidding products to cart')
      return
    }
    if (quantity > product.stock) {
      setError(`Only ${product.stock} items available`)
      return
    }

    setAddingToCart(true)
    setError('')

    try {
      await axios.post(
        `http://localhost:5000/api/cart`,
        {
          productId: id,
          quantity
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      )

      setError('Item added to cart successfully!')
    } catch (error) {
      setError(error.response?.data?.message || 'Error adding to cart')
    } finally {
      setAddingToCart(false)
    }
  }

  const handleSubmitReview = async (rating, reviewText) => {
    if (!userHasOrdered) {
      setError('You must purchase this product before reviewing')
      return
    }
    if (rating === 0) {
      setError('Please select a rating')
      return
    }
    if (!reviewText.trim()) {
      setError('Please write your review')
      return
    }

    try {
      await axios.post(
        `http://localhost:5000/api/products/${id}/reviews`,
        {
          rating,
          comment: reviewText.trim()
        },
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      )

      setError('Review submitted successfully!')

      const response = await axios.get(
        `http://localhost:5000/api/products/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          withCredentials: true
        }
      )
      setProduct(response.data)
    } catch (error) {
      setError(error.response?.data?.message || 'Error submitting review')
    }
  }

  const getCategoryIcon = category => {
    switch (category) {
      case 'crop':
        return <span className='text-green-600 font-medium'>Crop</span>
      case 'fertilizer':
        return <span className='text-amber-600 font-medium'>Fertilizer</span>
      case 'equipment':
        return <span className='text-blue-600 font-medium'>Equipment</span>
      default:
        return <span className='text-gray-600 font-medium'>Other</span>
    }
  }

  const formatDate = dateString => {
    const options = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  if (loading || !product) {
    return (
      <div className='flex items-center justify-center h-64'>
        <Loader2 className='h-8 w-8 text-green-600 animate-spin' />
        <span className='ml-2 text-green-800'>Loading product details...</span>
      </div>
    )
  }

  const userBid = product.bids?.find(
    bid => bid.userId === Cookies.get('userId')
  )
  const otherBids = [
    ...(product.bids?.filter(bid => bid.userId !== Cookies.get('userId')) || [])
  ].sort((a, b) => b.quantity - a.quantity)
  const reviews = product.reviews || []
  const averageRating =
    reviews.length > 0
      ? reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length
      : 0

  const biddingEnded = isBiddingEnded(product)
  const productSold = isProductSold(product)

  return (
    <div className='min-h-screen w-full bg-gradient-to-b from-green-50 to-white'>
      <div className='container mx-auto px-4 py-8'>
        <Link
          to='/display'
          className='inline-flex items-center text-green-700 hover:text-green-800 mb-6'
        >
          <ArrowLeft className='h-4 w-4 mr-1' /> Back to products
        </Link>

        {error && (
          <div className='mb-6 bg-red-50 border border-red-200 text-red-600 p-4 rounded-lg'>
            {error}
          </div>
        )}

        <div className='grid grid-cols-1 lg:grid-cols-12 gap-8'>
          {/* Product Images Column */}
          <div className='lg:col-span-5'>
            <ProductImageGallery images={product.images} />
          </div>

          {/* Product Details Column */}
          <div className='lg:col-span-7'>
            <div className='bg-white rounded-lg border border-green-100 shadow-sm overflow-hidden'>
              <div className='bg-gradient-to-r from-green-100 to-emerald-50 p-4'>
                <h1 className='text-2xl font-bold text-green-800'>
                  {product.name}
                </h1>
                <div className='flex items-center mt-2'>
                  <span className='text-sm text-green-700'>
                    Category: {getCategoryIcon(product.category)}
                  </span>
                  <span className='text-sm text-green-700 ml-4'>
                    Seller: {product.sellerId?.name || 'Unknown'}
                  </span>
                </div>
                {reviews.length > 0 && (
                  <div className='flex items-center mt-2'>
                    <div className='flex'>
                      {[1, 2, 3, 4, 5].map(star => (
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
                    <span className='text-sm text-green-700 ml-2'>
                      {averageRating.toFixed(1)} ({reviews.length} reviews)
                    </span>
                  </div>
                )}
              </div>

              <div className='p-6'>
                <div className='space-y-4'>
                  <div>
                    <h3 className='text-lg font-semibold text-green-800'>
                      Description
                    </h3>
                    <p className='text-gray-700 mt-1'>{product.description}</p>
                  </div>

                  <div className='grid grid-cols-2 gap-4'>
                    <div className='bg-green-50 p-3 rounded-lg'>
                      <h4 className='text-sm font-medium text-green-700'>
                        {product.isBiddingEnabled ? 'Minimum Bid' : 'Price'}
                      </h4>
                      <p className='text-2xl font-bold text-green-800'>
                        ₹
                        {product.isBiddingEnabled
                          ? product.minimumBidAmount.toFixed(2)
                          : product.price?.toFixed(2)}
                      </p>
                    </div>

                    <div className='bg-green-50 p-3 rounded-lg'>
                      <h4 className='text-sm font-medium text-green-700'>
                        Stock
                      </h4>
                      <div className='flex items-center'>
                        <p className='text-2xl font-bold text-green-800'>
                          {product.stock}
                        </p>
                      </div>
                    </div>
                  </div>

                  {product.isBiddingEnabled && product.biddingEndDate && (
                    <div
                      className={`p-3 rounded-lg ${
                        biddingEnded
                          ? productSold
                            ? 'bg-green-50 border border-green-100'
                            : 'bg-purple-50 border border-purple-100'
                          : 'bg-amber-50 border border-amber-100'
                      }`}
                    >
                      <div className='flex items-center'>
                        {biddingEnded ? (
                          productSold ? (
                            <CheckCircle className='h-5 w-5 text-green-600 mr-2' />
                          ) : (
                            <XCircle className='h-5 w-5 text-purple-600 mr-2' />
                          )
                        ) : (
                          <Clock className='h-5 w-5 text-amber-600 mr-2' />
                        )}
                        <div>
                          <h4
                            className={`text-sm font-medium ${
                              biddingEnded
                                ? productSold
                                  ? 'text-green-700'
                                  : 'text-purple-700'
                                : 'text-amber-700'
                            }`}
                          >
                            {biddingEnded
                              ? productSold
                                ? 'Bidding Ended - Product Sold'
                                : 'Bidding Ended - Not Sold'
                              : 'Bidding Ends On'}
                          </h4>
                          <p
                            className={`font-medium ${
                              biddingEnded
                                ? productSold
                                  ? 'text-green-800'
                                  : 'text-purple-800'
                                : 'text-amber-800'
                            }`}
                          >
                            {formatDate(product.biddingEndDate)}
                            {biddingEnded && !productSold && (
                              <span className='block text-sm mt-1'>
                                This product is no longer available for bidding
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  {product.isBiddingEnabled ? (
                    <BiddingSection
                      product={product}
                      userBid={userBid}
                      otherBids={otherBids}
                      onPlaceBid={handlePlaceBid}
                      placingBid={placingBid}
                      biddingEnded={biddingEnded}
                    />
                  ) : (
                    <BuyNowSection
                      product={product}
                      onPlaceOrder={handlePlaceOrder}
                      onAddToCart={handleAddToCart}
                      placingOrder={placingOrder}
                      addingToCart={addingToCart}
                    />
                  )}
                </div>
              </div>
            </div>

            <ProductReviews
              reviews={reviews}
              averageRating={averageRating}
              userHasOrdered={userHasOrdered}
              onSubmitReview={handleSubmitReview}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetails
