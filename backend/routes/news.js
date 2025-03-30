const express = require("express");
const axios = require("axios");
require("dotenv").config(); // Load environment variables
const verifyToken = require("../middlewares/verifyToken");
const router = express.Router();

module.exports = (io) => {
  // GET /api/news - Fetch news from GNews API
  router.get("/", async (req, res) => {
    try {
    const topics = ["agriculture", "farming", "farmer policies" ,"farmer"];
      const languages = ["hi", "en"]; // Separate requests for Hindi & English

      // Fetch news for each topic in both languages
      const newsRequests = topics.flatMap((topic) =>
        languages.map((lang) =>
          axios
            .get("https://gnews.io/api/v4/search", {
              params: {
                q: topic,
                lang, // Single language per request
                country: "in",
                max: 5, // Fetch 5 articles per topic per language
                token: process.env.GNEWS_API_KEY,
              },
            })
            .then((response) => response.data.articles)
            .catch((error) => {
             
              return [];
            })
        )
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
