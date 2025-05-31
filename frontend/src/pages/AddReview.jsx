import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function AddReviewPage() {
  const { productId } = useParams();
  const navigate = useNavigate();

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitReview = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { data } = await axios.post(
        `/api/products/${productId}/review`,
        { rating, comment },
        { withCredentials: true } // send cookies automatically
      );

      alert('Review submitted successfully!');
      navigate(`/product/${productId}`);
    } catch (err) {
      setError(
        err.response?.data?.message || err.message || 'Failed to submit review'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow mt-10">
      <h2 className="text-2xl font-semibold mb-4">Add a Review</h2>
      {error && <p className="text-red-600 mb-4">{error}</p>}

      <form onSubmit={submitReview}>
        <label className="block mb-2 font-medium">Rating (1 to 5)</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
          className="w-full border rounded px-3 py-2 mb-4"
          required
        >
          {[1, 2, 3, 4, 5].map((r) => (
            <option key={r} value={r}>
              {r}
            </option>
          ))}
        </select>

        <label className="block mb-2 font-medium">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          rows={5}
          className="w-full border rounded px-3 py-2 mb-4"
          placeholder="Write your review here"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700 transition"
        >
          {loading ? 'Submitting...' : 'Submit Review'}
        </button>
      </form>
    </div>
  );
}
