import React, { useState, useEffect } from "react";
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
import { useTranslation } from "react-i18next";

import { CloudUpload as CloudUploadIcon, Preview as PreviewIcon } from "@mui/icons-material";
const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
const SubmitStory = () => {
    const { t } = useTranslation();

    const [title, setTitle] = useState("");
    const [subHeading, setSubHeading] = useState("");
    const [description, setDescription] = useState("");
    const [imageUrl, setImageUrl] = useState("");
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState(false);
    const [userId, setUserId] = useState(null);

    const [farmerName, setFarmerName] = useState(""); // ✅ Store farmer's name


    const navigate = useNavigate();
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/users/me`, {
                    withCredentials: true,
                });

                const user = response.data.user;
                console.log("👤 Logged-in user:", user);

                setUserId(user?.id);
                setFarmerName(user?.name || ""); // ✅ Set farmerName from backend
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
    }, []);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);


        try {

            const storyData = {
                title,
                subHeading,
                description,
                imageUrl,
                farmerName: farmerName || t("submitStory.anonymous"), // ✅ Send user input, or default to Anonymous
            };
            console.log("📩 Sending Story Data:", storyData);

            const response = await axios.post(
                "http://localhost:5000/api/success-stories/add",
                storyData,
                { withCredentials: true }
            );

            alert(t("submitStory.successMessage"));
            navigate("/stories"); // ✅ Redirect to success stories page
        } catch (error) {
            console.error("❌ Error submitting story:", error);
            alert(t("submitStory.errorMessage"));
        } finally {
            setLoading(false);
        }
    };


    return (
        <Container maxWidth="md" className="submit-story-container">
            <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3 }}>
                <CardContent>
                    <Typography variant="h4" align="center" gutterBottom>
                        🌱     {t("submitStory.title")}
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <form onSubmit={handleSubmit} className="submit-story-form">
                        {/* Story Title */}
                        <Typography variant="h6" gutterBottom>
                            {t("submitStory.storyTitle")}
                        </Typography>
                        <TextField
                            label={t("submitStory.storyTitlePlaceholder")}
                            variant="outlined"
                            fullWidth
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />

                        {/* Farmer's Name Field */}
                        <Typography variant="h6" gutterBottom>
                            {t("submitStory.yourName")}
                        </Typography>
                        <TextField
                            label={t("submitStory.yourNamePlaceholder")}
                            variant="outlined"
                            fullWidth
                            value={farmerName}
                            disabled // ✅ Optional: disable editing if you trust backend
                            sx={{ mb: 2 }}
                        />



                        {/* Sub-Heading */}
                        <Typography variant="h6" gutterBottom>
                            {t("submitStory.subHeading")}
                        </Typography>
                        <TextField
                            label={t("submitStory.subHeadingPlaceholder")}
                            variant="outlined"
                            fullWidth
                            value={subHeading}
                            onChange={(e) => setSubHeading(e.target.value)}
                            required
                            sx={{ mb: 2 }}
                        />

                        {/* Main Story */}
                        <Typography variant="h6" gutterBottom>
                            {t("submitStory.storyJourney")}
                        </Typography>
                        <TextField
                            label={t("submitStory.storyJourneyPlaceholder")}
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
                            {t("submitStory.imageUpload")}
                        </Typography>
                        <TextField
                            label={t("submitStory.imageUploadPlaceholder")}
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
                            {preview ? t("submitStory.hidePreviewButton") : t("submitStory.previewButton")}
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
                                    {title || t("submitStory.storyTitlePlaceholder")}
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom color="gray">
                                    {subHeading || t("submitStory.subHeadingPlaceholder")}
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
                                    {description || t("submitStory.storyJourneyPlaceholder")}
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
                            {loading ? <CircularProgress size={24} /> : t("submitStory.submitButton")}
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </Container>
    );

};

export default SubmitStory;
