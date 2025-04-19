

// ✅ Configure Cloudinary Storage for Videos
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const cloudinary = require("../config/cloudinary");

// ✅ Configure Cloudinary Storage for Videos
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => {
        console.log("📁 Uploading file:", file.originalname); // ✅ Log file being uploaded
        return {
            folder: "KisanMitra/Videos", // ✅ Folder name on Cloudinary
            resource_type: "video", // ✅ Ensures videos are stored
            allowed_formats: ["mp4", "mov", "avi"], // ✅ Allowed video formats
        };
    }
});

// ✅ Check if storage is initialized
console.log("🟢 Multer Cloudinary Storage Initialized:", storage);

// ✅ File Upload Middleware with Error Handling
const upload = multer({
    storage,
    limits: { fileSize: 100 * 1024 * 1024 }, // ✅ Limit file size to 100MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = ["video/mp4", "video/quicktime", "video/x-msvideo"];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            console.error("❌ Unsupported file type:", file.mimetype);
            cb(new Error("Only MP4, MOV, and AVI video files are allowed!"), false);
        }
    },
});

module.exports = upload;
