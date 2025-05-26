import React, { useEffect, useState } from "react";
import axios from "axios";
import YouTube from "react-youtube"; // ✅ Import YouTube API
import { Container, Typography, Grid, Card, CardMedia, CardContent, Chip, Box, TextField, Button } from "@mui/material";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
import { io } from "socket.io-client";
const socket = io(backendUrl);
const VideoGallery = () => {
    const [expertVideos, setExpertVideos] = useState([]);
    const [farmerVideos, setFarmerVideos] = useState([]);
    const [userRole, setUserRole] = useState(null); // ✅ Store user role for admin check
    const [earnings, setEarnings] = useState(0);
    const [reviewTexts, setReviewTexts] = useState({});
    const[user,setUser]=useState(null);
    useEffect(() => {
        const fetchVideos = async () => {
            console.log("here")
            try {
                axios.get(`${backendUrl}/api/videos`)
                    .then(response => {
                        const expertRes = response.data.filter(video => video.category === "Expert");
                        const farmerRes = response.data.filter(video => video.category !== "Expert");
                        setExpertVideos(expertRes);
                        setFarmerVideos(farmerRes);
                        console.log("videos fetched")
                    })
            } catch (error) {
                console.error("Error fetching videos:", error);
            }
        }
       
            const fetchUser = async () => {
                try {
                    const response = await axios.get(`${backendUrl}/api/users/me`, {
                        withCredentials: true,
                    });
    
                    const user = response.data.user;
                    console.log("👤 Logged-in user:", user);
    
                    setUser(user?.id);
                   
                } catch (error) {
                    console.error("Error fetching user:", error);
                }
            };
    
            fetchUser();
        
    
        
        if (user) {
             setUserRole(user.role);
            setUser(user)
             if (user.role === "farmer") fetchEarnings(); // ✅ Set user role for conditional earnings display
        }

        fetchVideos();
    }, []);

    useEffect(() => {
        socket.on("videoUpdated", (updatedVideo) => {
            setFarmerVideos((prevVideos) =>
                prevVideos.map((video) => (video._id === updatedVideo._id ? updatedVideo : video))
            );
        });

        return () => socket.off("videoUpdated");
    }, []);

    const handleDeleteVideo = async (videoId) => {
        try {
            await axios.delete(
                `${backendUrl}/api/videos/delete/${videoId}`,{
                withCredentials: true,
        });
    
            // ✅ Remove video from state after successful deletion
            setFarmerVideos((prevVideos) => prevVideos.filter(video => video._id !== videoId));
            alert("Video deleted successfully!");
        } catch (error) {
            console.error("❌ Error deleting video:", error);
            alert("Failed to delete video");
        }
    };


    const fetchEarnings = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/videos/earnings`, {
                withCredentials: true,
            });
            setEarnings(response.data.earnings);
        } catch (error) {
            console.error("Error fetching earnings:", error);
        }
    };
    const increaseViewCount = async (videoId) => {
        try {
            await axios.put(`${backendUrl}/api/videos/update-views/${videoId}`);
            socket.emit("videoUpdated", videoId);
        } catch (error) {
            console.error("Error updating views:", error);
        }
    };

    const handleReviewSubmit = async (videoId) => {
        const reviewText = reviewTexts[videoId] || ""; // ✅ Get review text for specific video
        if (!reviewText.trim()) return alert("Review cannot be empty!");
     
        try {
            const response = await axios.post(
                `${backendUrl}/api/videos/review/${videoId}`,
                { reviewText },{
                withCredentials: true,
                }
            );
            console.log(response);
            const updatedVideo = response.data; // ✅ Get updated video with populated reviews

        // ✅ Update state immediately with the new review containing user name
        setFarmerVideos((prevVideos) =>
            prevVideos.map((video) =>
                video._id === videoId ? updatedVideo : video));
        setReviewTexts("");
            socket.emit("videoUpdated", response.data); // ✅ Emit real-time update
        } catch (error) {
            console.error("Error submitting review:", error);
        }
    };


    const getYouTubeVideoId = (url) => {
        const match = url.match(/[?&]v=([^&]+)/);
        return match ? match[1] : url.split("/").pop();
    };

    


    return (
        <Container maxWidth="lg" sx={{ mt: 5 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                🎥 Video Gallery
            </Typography>

            {/* ✅ Farmer Earnings Display */}
            {userRole === "farmer" && (
                <Typography variant="h5" color="green" sx={{ mb: 3 }}>
                    💰 Your Total Earnings: ₹{earnings.toFixed(2)}
                </Typography>
            )}

            {/* ✅ Expert YouTube Videos */}
            <Typography variant="h5" sx={{ mt: 4, mb: 2, color: "#1976d2" }}>
                📚 Expert Videos (YouTube)
            </Typography>
            <Grid container spacing={3}>
                {expertVideos.map((video) => (
                    <Grid item xs={12} sm={6} md={4} key={getYouTubeVideoId(video._id)}>
                        <Card sx={{ p: 2, boxShadow: 3 }}>
                            <YouTube
                                videoId={video.youtubeId}
                                opts={{
                                    height: "250",
                                    width: "100%",
                                    playerVars: {
                                        autoplay: 0,
                                        controls: 1,
                                        modestbranding: 1,
                                        rel: 0,
                                        showinfo: 0,
                                    },
                                }}
                                iframeClassName="youtube-iframe"
                                style={{ borderRadius: "10px" }}
                            />
                            <CardContent>
                                <Typography variant="h6">{video.title}</Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* ✅ Farmer Uploaded Videos */}
            <Typography variant="h5" sx={{ mt: 4, mb: 2, color: "#4caf50" }}>
                🚜 Farmer Uploaded Videos
            </Typography>
            <Grid container spacing={3}>
                {farmerVideos.map((video) => (
                    <Grid item xs={12} sm={6} md={4} key={video._id}>
                        <Card sx={{ p: 2, boxShadow: 3 }}>
                            <CardMedia
                                component="video"
                                controls
                                src={video.videoUrl}
                                sx={{ height: 250 }}
                                onPlay={() => increaseViewCount(video._id)}
                            />
                            <CardContent>
                                <Typography variant="h6">{video.title}</Typography>
                                <Box sx={{ mt: 1, display: "flex", justifyContent: "space-between" }}>
                                    <Chip label={`👀 Views: ${video.views}`} color="primary" />
                                    <Chip label={`⭐ Reviews: ${video.reviews.length}`} color="secondary" />
                                </Box>

                                {/* ✅ Display reviews */}
                                {video.reviews.length > 0 ? (
                                    video.reviews.map((review, index) => (
                                        <Box key={index} sx={{ mt: 1, p: 1, backgroundColor: "#f5f5f5", borderRadius: "5px" }}>
                                            <Typography variant="body2">
                                                <strong>{review.user?.name || "Anonymous"}:</strong> {review.text}
                                            </Typography>
                                        </Box>
                                    ))
                                ) : (
                                    <Typography variant="body2" sx={{ mt: 1, fontStyle: "italic", color: "gray" }}>
                                        No reviews yet. Be the first to review!
                                    </Typography>
                                )}

                                {/* ✅ Add Review Input */}
                                <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                                    <TextField
                                        label="Write a review..."
                                        variant="outlined"
                                        size="small"
                                        sx={{ flexGrow: 1 }}
                                        value={reviewTexts[video._id] || ""}
                                        onChange={(e) => setReviewTexts((prev) => ({ ...prev, [video._id]: e.target.value }))}
                                        onKeyDown={(e) => e.key === "Enter" && handleReviewSubmit(video._id)}
                                    />
                                    <Button variant="contained" onClick={() => handleReviewSubmit(video._id)}>
                                        Submit
                                    </Button>
                                </Box>

                              
{/* {( user.userId === video.uploadedBy) &&  */}
{(
    <button onClick={() => handleDeleteVideo(video._id)} style={{ backgroundColor: "red", color: "white", padding: "5px 10px", borderRadius: "5px" }}>
        🗑 Delete Video
    </button>
)}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Container>
    );
};

export default VideoGallery;