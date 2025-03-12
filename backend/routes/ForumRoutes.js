const express = require("express");
const forumController= require( "../controllers/ForumController");
const router = express.Router();


router.post("/create", forumController.createForum);
router.get("/", forumController.getForums);
router.post("/answer/:postId",forumController.answer);

module.exports = router;