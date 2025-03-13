import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
    Container,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    CircularProgress,
    Divider,
    Box
} from "@mui/material";
import { CloudUpload as CloudUploadIcon, Preview as PreviewIcon } from "@mui/icons-material";

const SubmitStory = () => {
    const [title, setTitle] = useState("");
    const [subHeading, setSubHeading] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);
    const [farmerName, setFarmerName] = useState(""); // ✅ Store farmer's name


    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user")); // ✅ Get current user
    console.log(user)
    const userId = user?.userId || null; // ✅ Avoid undefined error

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);


        try {
            const token = localStorage.getItem("token"); // ✅ Ensure user is authenticated
            if (!token) {
                alert("You need to be logged in to submit a story!");
                setLoading(false);
                return;
            }
            const storyData = {
                title,
                subHeading,
                description,
                imageUrl,
                farmerName: farmerName || "Anonymous", // ✅ Send user input, or default to Anonymous
            };
            console.log("📩 Sending Story Data:", storyData);

            const response = await axios.post(
                "http://localhost:5000/api/success-stories/add",
               storyData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("🎉 Story submitted successfully!");
            navigate("/stories"); // ✅ Redirect to success stories page
        } catch (error) {
            console.error("❌ Error submitting story:", error);
            alert("Failed to submit story. Please try again.");
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container maxWidth="md" className="submit-story-container">
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        🌱 Share Your Success Story
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <form onSubmit={handleSubmit} className="submit-story-form">
                        {/* Story Title */}
                        <Typography variant="h6" gutterBottom>
                            📌 Title of Your Story
                        </Typography>
                        <TextField
                            label="Story Title"
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />

                        {/* Farmer's Name Field */}
                        <Typography variant="h6" gutterBottom>
                            👨‍🌾 Your Name (Optional)
                        </Typography>
                        <TextField
                            label="Your Name (or leave blank for Anonymous)"
                            variant="outlined"
                            fullWidth
                            value={farmerName}
                            onChange={(e) => setFarmerName(e.target.value)}
                            sx={{ mb: 2 }}
                        />


                        {/* Sub-Heading */}
                        <Typography variant="h6" gutterBottom>
                            ✨ Sub-Heading
                        </Typography>
                        <TextField
                            label="Short Sub-Heading"
                            variant="outlined"
                            fullWidth
                            value={subHeading}
                            onChange={(e) => setSubHeading(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />

                        {/* Main Story */}
                        <Typography variant="h6" gutterBottom>
                            📖 Your Journey
                        </Typography>
                        <TextField
                            label="Write your story in multiple paragraphs..."
                            variant="outlined"
                            multiline
                            rows={6}
                            fullWidth
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />

                        {/* Image Upload */}
                        <Typography variant="h6" gutterBottom>
                            📷 Add an Image (Optional)
                        </Typography>
                        <TextField
                            label="Image URL (Optional)"
                            variant="outlined"
                            fullWidth
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            sx={{ mb: 2 }}
                        />
                        {/* <Button
                                variant="contained"
                                component="label"
                                sx={{ mb: 2 }}
                                startIcon={<CloudUploadIcon />}
                            >
                                Upload Image (Coming Soon)
                            </Button> */}

                        {/* Preview Button */}
                        <Button
                            variant="outlined"
                            fullWidth
                            startIcon={<PreviewIcon />}
                            onClick={() => setPreview(!preview)}
                            sx={{ mb: 3 }}
                        >
                            {preview ? "Hide Preview" : "Preview Story"}
                        </Button>

                        {/* Story Preview */}
                        {preview && (
                            <Box
                                sx={{
                                    p: 3,
                                    borderRadius: 2,
                                    backgroundColor: "#f9f9f9",
                                    boxShadow: 2,
                                    mb: 3
                                }}
                            >
                                <Typography variant="h5" gutterBottom>
                                    {title || "Your Story Title"}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom color="gray">
                                    {subHeading || "Sub-heading will appear here..."}
                                </Typography>
                                {imageUrl && (
                                    <img
                                        src={imageUrl}
                                        alt="Story"
                                        style={{
                                            width: "100%",
                                            maxHeight: "250px",
                                            objectFit: "cover",
                                            borderRadius: "8px",
                                            marginBottom: "10px"
                                        }}
                                    />
                                )}
                                <Typography variant="body1" sx={{ whiteSpace: "pre-line" }}>
                                    {description || "Your formatted story will appear here..."}
                                </Typography>
                            </Box>
                        )}

                        {/* Submit Button */}
                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            sx={{ py: 1.5, fontSize: "16px" }}
                            disabled={loading}
                        >
                            {loading ? <CircularProgress size={24} /> : "Submit Story"}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );

};

export default SubmitStory;
