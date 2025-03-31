const express = require('express');
const upload = require('../config/multer');
const verifyToken = require('../middlewares/verifyToken.js');
const router = express.Router();
const User = require('../models/User.js');
const cloudinary = require('../config/cloudinary.js');

router.post('/upload-profile', verifyToken, upload.single('profileImage'), async (req, res) => {
    try {
        if (!req.user || !req.user.id) {
            return res.status(401).json({ message: 'Unauthorized: User not found' });
        }

        // Fetch user from the database
        const user = await User.findById(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        // if (user.profilePicture.length != 0) {
        //     // Extract the publicId from the Cloudinary URL
        //     const urlParts = user.profilePicture.split('/');
        //     const publicIdWithExtension = urlParts[urlParts.length - 1];
        //     const publicId = publicIdWithExtension.split('.')[0];

        //     console.log('Public ID to delete:', publicId); // Debugging - check the public ID

        //     // Delete image from Cloudinary using the publicId
        //     await cloudinary.uploader.destroy(publicId);
        // }

        // Upload the new image to Cloudinary (only this happens now)
        const cloudinaryResponse = await cloudinary.uploader.upload(req.file.path);

        // Update the user's profile image URL in the database
        user.profilePicture = cloudinaryResponse.secure_url;
        await user.save();

        res.json({
            message: 'Profile picture updated successfully',
            imageUrl: user.profilePicture
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({ user, profileImage: user.profilePicture || '' }); // Send profile image URL
    } catch (error) {
        console.error('Error fetching profile image:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.delete('/remove-profile', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (user.profilePicture) {
            // Extract the publicId from the Cloudinary URL
            const urlParts = user.profilePicture.split('/');
            // The second-to-last part is the publicId with the file extension
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            // Remove the file extension (e.g., .jpg, .png)
            const publicId = publicIdWithExtension.split('.')[0];
            
            console.log('Public ID to delete:', publicId);  // Debugging - check the public ID
            
            // Delete image from Cloudinary using the publicId
            await cloudinary.uploader.destroy(publicId);
            
        }

        // Set profileImage to an empty string (or default avatar)
        user.profilePicture = '';  // Clear the profile picture URL
        await user.save();

        res.json({ message: 'Profile picture removed successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
