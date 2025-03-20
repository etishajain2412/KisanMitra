import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // Connect to backend WebSocket

function News() {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expanded, setExpanded] = useState({}); // Track expanded articles

  useEffect(() => {
    // Fetch initial news data
    axios
      .get("http://localhost:5000/api/news", { withCredentials: true })
      .then((res) => {
        setNews(res.data.articles || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching news:", err);
        setError("Failed to load news. Please try again later.");
        setLoading(false);
      });

    // Listen for real-time news updates
    socket.on("newsUpdate", (updatedNews) => {
      console.log("🔴 Real-time news update received");
      setNews(updatedNews);
    });

    return () => {
      socket.off("newsUpdate"); // Cleanup on unmount
    };
  }, []);

  const toggleReadMore = (index) => {
    setExpanded((prev) => ({
      ...prev,
      [index]: !prev[index], // Toggle state for individual articles
    }));
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-green-600 text-center mb-6">
        Latest Agriculture News (India)
      </h1>

      {/* Show Loading Spinner */}
      {loading && (
        <div className="flex justify-center items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-green-600"></div>
        </div>
      )}

      {/* Show Error Message */}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* Show News Articles */}
      {!loading && !error && (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {news.length > 0 ? (
            news.map((article, index) => (
              <div key={index} className="bg-white p-4 shadow-lg rounded-lg">
                {/* Centered Image */}
                <img
                  src={article.image || "/default-news.jpg"}
                  alt={article.title}
                  className="w-full h-40 object-cover rounded-md mx-auto"
                />
                <h2 className="text-xl font-semibold mt-3">{article.title}</h2>
                <p className="text-sm text-gray-600 mt-2">
                  {expanded[index] ? article.description : `${article.description.slice(0, 100)}...`}
                </p>

                {/* Read More Button */}
                <button
                  onClick={() => toggleReadMore(index)}
                  className="mt-3 bg-green-600 text-white px-4 py-2 rounded-md w-full text-center"
                >
                  {expanded[index] ? "Read Less" : "Read More"}
                </button>

                <a
                  href={article.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline mt-3 block text-center"
                >
                  Go to Source
                </a>
              </div>
            ))
          ) : (
            <p className="text-center col-span-3 text-gray-500">
              No news articles available.
            </p>
          )}
        </div>
      )}
    </div>
  );
}

export default News;
