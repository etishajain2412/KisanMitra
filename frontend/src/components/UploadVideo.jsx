import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { TextField, Button, Select, MenuItem, Typography, Container, Box, CircularProgress } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";


const UploadVideo = () => {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [videoFile, setVideoFile] = useState(null); // ✅ Define videoFile state
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [category, setCategory] = useState("Tutorial");
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!videoFile) return alert("Please upload an MP4 video!");
        
         const token = localStorage.getItem("token"); // ✅ Get token
         if (!token) {
            console.error("❌ No token found in localStorage!");
            alert("You need to log in first.");
            return;
        }
        setLoading(true);
         const formData = new FormData();
        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("video", videoFile);
        try {
            console.log("🔵 Sending video upload request...");
            const response =  await axios.post(`${backendUrl}/api/videos/add`,formData, {
                headers: { 
        "Content-Type": "multipart/form-data",
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
    },
           
          
            });
            console.log("✅ Video uploaded successfully:", response.data); // ✅ Log success response
            setLoading(false);
            setSuccess(true);
            setTimeout(() => navigate("/videos"), 2000); // ✅ Redirect after 2s
        } catch (error) {
            console.error("Error uploading video:", error);
        }
    };

    return (
        <Container maxWidth="sm">
            <Box sx={{ mt: 5, p: 3, borderRadius: 2, boxShadow: 3, textAlign: "center", backgroundColor: "white" }}>
                <Typography variant="h4" fontWeight="bold" gutterBottom>
                    🎥 Upload Your Farming Video
                </Typography>
                <form onSubmit={handleSubmit} encType="multipart/form-data">
                    <TextField
                        fullWidth
                        label="Video Title"
                        variant="outlined"
                        margin="normal"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Description"
                        multiline
                        rows={3}
                        variant="outlined"
                        margin="normal"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                    />
                    <Select
                        fullWidth
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        variant="outlined"
                        sx={{ mb: 2 }}
                    >
                        <MenuItem value="Tutorial">Tutorial</MenuItem>
                        <MenuItem value="Webinar">Webinar</MenuItem>
                    </Select>
                    <input
                        type="file"
                        accept="video/mp4"
                        onChange={(e) => setVideoFile(e.target.files[0])}
                        style={{ display: "none" }}
                        id="upload-button"
                        required
                    />
                    <label htmlFor="upload-button">
                        <Button
                            variant="contained"
                            component="span"
                            fullWidth
                            sx={{ backgroundColor: "#4caf50", color: "white", my: 2 }}
                            startIcon={<CloudUploadIcon />}
                        >
                            {videoFile ? videoFile.name : "Choose Video File"}
                        </Button>
                    </label>
                    {loading ? (
                        <CircularProgress sx={{ my: 2 }} />
                    ) : success ? (
                        <Typography color="green" fontWeight="bold">
                            <CheckCircleIcon /> Video Uploaded Successfully! Redirecting...
                        </Typography>
                    ) : (
                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{ backgroundColor: "#4caf50", color: "white", my: 2 }}
                        >
                            Upload Video
                        </Button>
                    )}
                </form>
            </Box>
        </Container>
    );
};

export default UploadVideo;