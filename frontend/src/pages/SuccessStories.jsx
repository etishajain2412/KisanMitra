import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { FaHeart, FaRegHeart, FaCommentDots } from "react-icons/fa";


const socket = io("http://localhost:5000"); // ✅ Connect to backend socket

const SuccessStories = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const [stories, setStories] = useState([]);
    const [commentText, setCommentText] = useState({});
    const [showComments, setShowComments] = useState({});
    const user = JSON.parse(localStorage.getItem("user")); // ✅ Get current user
    console.log(user)
    const userId = user?.userId || null; // ✅ Avoid undefined error
   
   
     const navigate = useNavigate();
    useEffect(() => {
        fetchStories();
       

    socket.on("newStory", (newStory) => {
        setStories((prevStories) => [newStory, ...prevStories]);
    });
        socket.on("storyLiked", ({ storyId, likes, isLiked }) => {
            console.log(`🔹 Real-time update: Story ${storyId} now has ${likes} likes.`);
            setStories((prevStories) =>
                prevStories.map((story) =>
                    story._id === storyId ? { ...story, likes} : story
                )
            );
        });

        // ✅ Listen for live comments
        socket.on("storyCommented", ({ storyId, comment }) => {
            setStories((prevStories) =>
                prevStories.map((story) => 
                     (story._id === storyId) 
                       
                         ?{ ...story, comments: [...story.comments, comment] }
                         :story
                    
                )
            );
        })

        return () => {
            socket.off("storyLiked");
            socket.off("storyCommented");
            socket.off("newStory");
        };
    }, []);

    const fetchStories = async () => {
        try {
            const response = await axios.get("http://localhost:5000/api/success-stories/all");
          
            const updatedStories = response.data.map((story) => ({
                ...story,
                comments: story.comments || [],
            }));
    
            setStories(updatedStories); 
            
        } catch (error) {
            console.error("Error fetching stories:", error);
        }
    };

    const toggleLike = useCallback(async(storyId) => {
        
        if (!userId) {
            alert("You must be logged in to like a story.");
            return;
        }
        console.log("🔥 Incoming like request from:", user.userId, "for story:", storyId);
   
    try {
      
        const response = await axios.post(`${backendUrl}/api/success-stories/like/${storyId}`, {
        userId },
        
        );
        console.log("Response from like:", response.data);
        
        if (response.data.success) {
            // Update likes immediately in UI
            setStories((prevStories) =>
                prevStories.map((story) =>
                    story._id === storyId
            ? { ...story, likes: response.data.likes, likedBy: response.data.likedBy }
            : story
        )
    );
    socket.emit("storyLiked", { storyId, likes: response.data.likes,
        userId });}
    } catch (error) {
        console.error("Error liking story:", error);
    }
    
      

       
            
    },[userId,backendUrl]);
    const handleCommentSubmit = async (storyId) => {
        const text = commentText[storyId] || "";  // ✅ Fetch comment for this story

    if (typeof text !== "string" || text.trim() === "") return;
   // ✅ Check if comment exists
       console.log(text)
        try {
          
            console.log("user: ",user)
    
            const commentData = {
                userId: user.userId, // ✅ Ensure the correct user ID
                userName: user.name, // ✅ Pass the user name
                text: text,
            };
    
            console.log("📩 Sending Comment Data:", commentData);
    
            const response = await axios.post(`${backendUrl}/api/success-stories/comment/${storyId}`, commentData);
            
            if (response.data.success) {
                const newComment = response.data.comment;
                
               // ✅ Fix: Update `stories` state to include new comment
           
    
                // ✅ Emit Socket Event for Live Update
                socket.emit("commentStory", { storyId: storyId, comment: newComment });
    
                setCommentText(""); // ✅ Clear input field
            }
        } catch (error) {
            console.error("❌ Error submitting comment:", error);
        }
    };
    console.log("stories", stories)
    const handleCommentChange = (storyId, text) => {
        setCommentText((prev) => ({
            ...prev,
            [storyId]: text,  // ✅ Only update the comment for the specific story
        }));
    };
    
    const toggleComments = (storyId) => {
        setShowComments((prevState) => ({
            ...prevState,
            [storyId]: !prevState[storyId],
        }));
    };
    
    return (
        <div className="success-stories-container">
            <h1 className="page-title">🌾 Success Stories of Farmers</h1>

            {/* Submit Story Button */}
            <div className="submit-story-container">
                <button className="submit-story-btn" onClick={() => navigate("/stories/submit")}>
                    ✍️ Share Your Story
                </button>
            </div>

            {/* Success Stories List */}
            <div className="stories-list">
                {stories.length === 0 ? (
                    <p className="no-stories">No stories available. Be the first to share one!</p>
                ) : (
                    stories.map((story) => (
                        <div key={story._id} className="story-card">
                            <h3 className="story-title">{story.title}</h3>
                            <p className="story-author">👤 {story.farmerName}</p>
                            <p className="story-description">{story.description}</p>

                            {/* Image Display (if available) */}
                            {story.imageUrl && <img className="story-image" src={story.imageUrl} alt="Story" />}

                            {/* Like & Comment Section */}
                            <div className="story-actions">
                                {/* Like Button (Always Visible) */}
                                <button
                                   className={`like-btn ${Array.isArray(story.likedBy) && story.likedBy.includes(userId) ? "liked" : ""}`} 
                                   onClick={() => toggleLike(story._id)}
                                >
                                    {Array.isArray(story.isLiked) && story.likedBy.includes(userId) ? (
                                        <FaHeart className="liked-icon red-heart" />
                                    ) : (
                                        <FaRegHeart />
                                    )}
                                    {story.likes}
                                </button>

                                {/* Toggle Comment Button */}
                                <button className="toggle-comment-btn" onClick={() => toggleComments(story._id)}>
                                    <FaCommentDots /> {showComments[story._id] ? "Hide Comments" : "Show Comments"}
                                </button>
                            </div>

                            {/* Comment Section (Togglable) */}
                            {showComments[story._id] && (
                                <div className="comment-section">
                                    <input
                                        type="text"
                                        className="comment-input"
                                        placeholder="Write a comment..."
                                        value={commentText[story._id] || ""}  // ✅ Get comment for this specific story
                                        onChange={(e) => handleCommentChange(story._id, e.target.value)}  // ✅ Updat
                                        />
                                    <button className="comment-btn" onClick={() => handleCommentSubmit(story._id)}>
                                        Comment
                                    </button>

                                    {/* Display Comments */}
                                    <div className="comments-list">
                                        {story.comments.map((comment, index) => (
                                            <p key={index} className="comment">
                                                <strong>{comment.userName || "Anonymous"}:</strong> {comment.text}
                                            </p>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default SuccessStories;