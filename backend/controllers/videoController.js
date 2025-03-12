const Video = require("../models/Video");
const mongoose = require("mongoose");
const cloudinary = require("../config/cloudinary");

// ✅ Get all videos
exports.getVideos = async (req, res) => {
    try{
    const defaultVideos = [
        {
            _id: "default1",
            title: "Organic Farming Techniques",
            description: "Learn how to grow crops without chemicals.",
            videoUrl: "https://www.youtube.com/watch?v=5M6XBZkdexs",
            category: "Expert",
            views: 0,
            earnings: 0
        },
        {
            _id: "default2",
            title: "Drip Irrigation Explained",
            description: "Efficient water usage for farming.",
            videoUrl: "https://www.youtube.com/watch?v=3VjAAvS06wI",
            category: "Expert",
            views: 0,
            earnings: 0
        }
    ];

    // Fetch farmer-uploaded videos
    const uploadedVideos = await Video.find().populate({
        path: "reviews.user", // ✅ Populate user info inside reviews
        select: "name", // ✅ Fetch only the name field
    }).sort({ createdAt: -1 });;

    res.json([...defaultVideos, ...uploadedVideos]);
    } catch (error) {
        res.status(500).json({ message: "Error fetching videos" });
    }
};

// ✅ Add a new video (Only authenticated farmers)
exports.addVideo = async (req, res) => {
    try {
        console.log(`req at addvideo:` ,JSON.stringify(req.body,null,2));
        console.log(`user at addVideo: ${req.user.id }`)
        const { title, description, category } = req.body;
        if (!req.file || !req.file.path) {
            return res.status(400).json({ message: "MP4 video file is required" });
        }
        console.log("🟢 Video received:", req.file.path);
        const videoUrl = req.file.path; // ✅ Cloudinary video URL
        const newVideo = new Video({ 
            title, description, videoUrl, category, uploadedBy: req.user.id 
        });
        await newVideo.save();
        console.log("video save ");

        res.status(201).json({ message: "Video added successfully", newVideo });
    } catch (error) {
        res.status(500).json({ message: "Error adding video" });
    }
};

// ✅ Track views and update earnings
exports.updateViews = async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        console.log(`video found: ${video}`);
        if (!video) return res.status(404).json({ message: "Video not found" });

        video.views += 1;
        video.earnings += 0.1; // ₹0.05 per view (example)
        await video.save();

        res.json({ message: "View count updated", views: video.views, earnings: video.earnings });
    } catch (error) {
        res.status(500).json({ message: "Error updating views" });
    }
};

exports.getEarnings = async (req, res) => {
    try {
        const farmerId = req.user.id; // ✅ Extract logged-in farmer ID
        console.log(`farmer: ${farmerId}`);
        const videos = await Video.find({ uploadedBy: farmerId });
        const totalEarnings = videos.reduce((acc, vid) => acc + vid.earnings, 0);
        res.json({ earnings: totalEarnings, videos });
    } catch (error) {
        res.status(500).json({ message: "Error fetching earnings", error });
    }
};
exports.addReview = async (req, res) => {
    try {
        const { videoId } = req.params;
        const { reviewText } = req.body; // ✅ Get review text from frontend
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: "Unauthorized: User not found" });
        }
        const userId = req.user.id; 
        console.log("🔹 Received review from user:", userId);
        console.log("🔹 Review text:", reviewText);
        
        const video = await Video.findById(videoId);
        console.log(`video found: ${video}`);
        if (!video) return res.status(404).json({ message: "Video not found" });
        // ✅ Add new review

         // ✅ Fix: If reviews contains invalid data (`[0]`), reset it
         if (!Array.isArray(video.reviews) || video.reviews.some((r) => typeof r !== "object")) {
            console.log("❌ Fixing incorrect reviews format...");
            video.reviews = []; // ✅ Reset reviews to an empty array
        }
        console.log("🔹 Pushing review to video...");
        video.reviews.push({
            user: new mongoose.Types.ObjectId(userId), // ✅ Ensure it's an ObjectId
            text: reviewText,
        });
        console.log(video)
        await video.save();

        console.log("video review saved in datbase")
        const updatedVideo = await Video.findById(videoId).populate("reviews.user", "name"); // ✅ Populate user info
        // ✅ Broadcast updated video data via Socket.io
        io.emit("videoUpdated", updatedVideo);
       console.log("broadcasted review")
        res.json(updatedVideo);
    } catch (error) {
        res.status(500).json({ message: "Error adding review", error });
    }
};


exports.deleteVideo = async (req, res) => {
    try {
        const { videoId } = req.params;
        const userId = req.user?.id; // ✅ Extract logged-in user ID

        console.log("🔹 Received request to delete video:", videoId);
        console.log("👤 User ID:", userId);
        console.log("at delete function")
        console.log(` ${videoId}`)
        const video = await Video.findById(videoId).populate("uploadedBy", "name");;
       
        if (!video) {
            return res.status(404).json({ message: "Video not found" });
        }
        console.log(video);
        // ✅ Check if `uploadedBy` exists before calling `.toString()`
        // if (!video.uploadedBy) {
        //     return res.status(400).json({ message: "Video does not have an uploader associated" });
        // }
        // if (!video.uploadedBy) {
        //     console.log("❌ `uploadedBy` is missing in the database.");
        //     return res.status(400).json({ message: "This video has no uploader associated and cannot be deleted" });
        // }


        // ✅ Only allow admin or the uploader to delete
        // if (req.user.role !== "admin" && video.uploadedBy._id.toString() !== userId) {
        //     return res.status(403).json({ message: "Unauthorized to delete this video" });
        // }
        console.log("checked condition")

        console.log(" ✅ Extract public ID from Cloudinary URL")
        const publicId = video.videoUrl.split("/").pop().split(".")[0];
        console.log(publicId)
        // ✅ Delete video from Cloudinary
        await cloudinary.uploader.destroy(`KisanMitra/Videos/${publicId}.mp4`, { resource_type: "video" });

        // ✅ Remove video from database
        await Video.findByIdAndDelete(videoId);

        res.json({ message: "Video deleted successfully" });
    } catch (error) {
        console.error("❌ Error deleting video:", error);
        res.status(500).json({ message: "Error deleting video", error });
    }
};
