const express = require("express");
const axios = require("axios");
require("dotenv").config(); // Load environment variables
const verifyToken=require('../middlewares/verifyToken')
const router = express.Router();

module.exports = (io) => {
  // GET /api/news - Fetch news from GNews API
  router.get("/", verifyToken,async (req, res) => {
    try {
      const topics = ["agriculture", "farming", "farmer policies"];

      // Fetch all topics in parallel
      const newsRequests = topics.map((topic) =>
        axios
          .get("https://gnews.io/api/v4/search", {
            params: {
              q: topic,
              lang: "en",
              country: "in",
              max: 5, // Fetch 5 articles per topic
              token: process.env.GNEWS_API_KEY,
            },
          })
          .then((response) => response.data.articles)
          .catch((error) => {
            console.error(`Error fetching news for topic ${topic}:`, error.message);
            return [];
          })
      );

      // Wait for all API calls to complete
      const allArticles = (await Promise.all(newsRequests)).flat();

      res.header("Access-Control-Allow-Origin", "http://localhost:3000");
      res.header("Access-Control-Allow-Credentials", "true");
      res.json({ articles: allArticles });

      // Emit the news update to all connected clients
      io.emit("newsUpdate", allArticles);
    } catch (error) {
      console.error("Error fetching news:", error.message);
      res.status(500).json({ message: "Error fetching news", error: error.message });
    }
  });

  return router;
};
