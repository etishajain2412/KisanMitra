const express = require("express");
const { getVideos, addVideo, updateViews, getEarnings, addReview, deleteVideo } = require("../controllers/videoController");
const  verifyToken  = require("../middlewares/verifyToken");
const upload = require("../middlewares/upload");

const router = express.Router();

// ✅ Get all videos
router.get("/", getVideos);

// ✅ Upload MP4 video to Cloudinary (Only authenticated farmers)
router.post("/add", verifyToken, upload.single("video"), addVideo);

// ✅ Track views & update earnings
router.put("/update-views/:id", updateViews);
// ✅ Get Farmer Earnings
router.get("/earnings", verifyToken, getEarnings);
router.post("/review/:videoId", verifyToken, addReview);

router.delete("/delete/:videoId", verifyToken, deleteVideo);


module.exports = router;
