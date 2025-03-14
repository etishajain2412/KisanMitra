import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { FaHeart, FaRegHeart, FaCommentDots } from "react-icons/fa";
import { Container, Row, Col, Card, Button, Form } from "react-bootstrap"; // Bootstrap components
import { useTranslation } from "react-i18next";

const socket = io("http://localhost:5000"); // ✅ Connect to backend socket

const SuccessStories = () => {
    const { t } = useTranslation();

    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const [stories, setStories] = useState([]);
    const [commentText, setCommentText] = useState({});
    const [showComments, setShowComments] = useState({});
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId || null;
    const navigate = useNavigate();

    useEffect(() => {
        fetchStories();

        socket.on("newStory", (newStory) => {
            setStories((prevStories) => [newStory, ...prevStories]);
        });

        socket.on("storyLiked", ({ storyId, likes }) => {
            setStories((prevStories) =>
                prevStories.map((story) =>
                    story._id === storyId ? { ...story, likes } : story
                )
            );
        });

        socket.on("storyCommented", ({ storyId, comment }) => {
            setStories((prevStories) =>
                prevStories.map((story) =>
                    story._id === storyId ? { ...story, comments: [...story.comments, comment] } : story
                )
            );
        });

        return () => {
            socket.off("storyLiked");
            socket.off("storyCommented");
            socket.off("newStory");
        };
    }, []);

    const fetchStories = async () => {
        try {
            const response = await axios.get(`${backendUrl}/api/success-stories/all`);
            const updatedStories = response.data.map((story) => ({
                ...story,
                comments: story.comments || [],
            }));
            setStories(updatedStories);
        } catch (error) {
            console.error("Error fetching stories:", error);
        }
    };

    const toggleLike = useCallback(async (storyId) => {
        if (!userId) {
            alert(t("successStories.loginToLike"));
            return;
        }

        try {
            const response = await axios.post(`${backendUrl}/api/success-stories/like/${storyId}`, { userId });
            if (response.data.success) {
                setStories((prevStories) =>
                    prevStories.map((story) =>
                        story._id === storyId
                            ? { ...story, likes: response.data.likes, likedBy: response.data.likedBy }
                            : story
                    )
                );
                socket.emit("storyLiked", { storyId, likes: response.data.likes, userId });
            }
        } catch (error) {
            console.error("Error liking story:", error);
        }
    }, [userId, backendUrl]);

    const handleCommentSubmit = async (storyId) => {
        const text = commentText[storyId] || "";
        if (typeof text !== "string" || text.trim() === "") return;

        try {
            const commentData = {
                userId: user.userId,
                userName: user.name,
                text: text,
            };

            const response = await axios.post(`${backendUrl}/api/success-stories/comment/${storyId}`, commentData);
            if (response.data.success) {
                const newComment = response.data.comment;
                socket.emit("commentStory", { storyId: storyId, comment: newComment });
                setCommentText("");
            }
        } catch (error) {
            console.error("❌ Error submitting comment:", error);
        }
    };

    const handleCommentChange = (storyId, text) => {
        setCommentText((prev) => ({
            ...prev,
            [storyId]: text,
        }));
    };

    const toggleComments = (storyId) => {
        setShowComments((prevState) => ({
            ...prevState,
            [storyId]: !prevState[storyId],
        }));
    };

    return (
        <Container className="mt-4">
            <h1 className="text-center mb-4">{t("successStories.title")}</h1>

            {/* Share Story Button */}
            <div className="text-center mb-4">
                <Button variant="primary" onClick={() => navigate("/stories/submit")}>
                {t("successStories.shareStoryButton")}
                </Button>
            </div>

            {/* Success Stories Grid */}
            <Row className="g-4">
                {stories.length === 0 ? (
                    <Col>
                        <p className="text-center">{t("successStories.noStories")}</p>
                    </Col>
                ) : (
                    stories.map((story) => (
                        <Col key={story._id} xs={12} md={6}>
                            <Card className="shadow-sm h-100">
                                {story.imageUrl && <Card.Img variant="top" src={story.imageUrl} alt="Story" />}
                                <Card.Body>
                                    <Card.Title>{story.title}</Card.Title>
                                    <Card.Subtitle className="mb-2 text-muted">👤 {story.farmerName}</Card.Subtitle>
                                    <Card.Text>{story.description}</Card.Text>
                                </Card.Body>
                                <Card.Footer className="d-flex justify-content-between">
                                    {/* Like Button */}
                                    <Button
                                        variant={Array.isArray(story.likedBy) && story.likedBy.includes(userId) ? "danger" : "outline-danger"}
                                        onClick={() => toggleLike(story._id)}
                                    >
                                        {Array.isArray(story.isLiked) && story.likedBy.includes(userId) ? (
                                            <FaHeart className="red-heart" />
                                        ) : (
                                            <FaRegHeart />
                                        )}{" "}
                                        {story.likes}{t("successStories.like")}
                                    </Button>

                                    {/* Show/Hide Comments Button */}
                                    <Button variant="outline-secondary" onClick={() => toggleComments(story._id)}>
                                        <FaCommentDots /> {showComments[story._id] ? t("successStories.hideComments") : t("successStories.showComments")}
                                    </Button>
                                </Card.Footer>

                                {/* Comments Section (Togglable) */}
                                {showComments[story._id] && (
                                    <Card.Body>
                                        <Form>
                                            <Form.Group>
                                                <Form.Control
                                                    type="text"
                                                    placeholder="Write a comment..."
                                                    value={commentText[story._id] || ""}
                                                    onChange={(e) => handleCommentChange(story._id, e.target.value)}
                                                />
                                            </Form.Group>
                                            <Button
                                                variant="success"
                                                className="mt-2"
                                                onClick={() => handleCommentSubmit(story._id)}
                                            >
                                                Comment
                                            </Button>
                                        </Form>

                                        {/* Display Comments */}
                                        {story.comments.map((comment, index) => (
                                            <div key={index} className="mt-2">
                                                <strong>{comment.userName || "Anonymous"}:</strong> {comment.text}
                                            </div>
                                        ))}
                                    </Card.Body>
                                )}
                            </Card>
                        </Col>
                    ))
                )}
            </Row>
        </Container>
    );
};

export default SuccessStories;
