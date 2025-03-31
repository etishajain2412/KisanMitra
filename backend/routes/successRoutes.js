const express = require("express");
const { addStory, getStories, likeStory, addComment } = require("../controllers/successController");
const router = express.Router();
const verifyToken = require("../middlewares/verifyToken");


router.post("/add",verifyToken, addStory);
router.get("/all", getStories);
router.post("/like/:storyId",verifyToken, likeStory);
router.post("/comment/:storyId", addComment);

module.exports = router;
