import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { FaHeart, FaRegHeart, FaComment, FaUser, FaShareAlt, FaLeaf } from "react-icons/fa";
import { MdDateRange } from "react-icons/md";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { format } from "date-fns";
axios.defaults.withCredentials = true;

const socket = io("http://localhost:5000");

const SuccessStories = () => {
  const { t } = useTranslation();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [stories, setStories] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [expandedStories, setExpandedStories] = useState({});
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [storiesRes, userRes] = await Promise.all([
          axios.get(`${backendUrl}/api/success-stories/all`),
          axios.get(`${backendUrl}/api/users/me`)
        ]);

        setStories(storiesRes.data.map(story => ({
          ...story,
          comments: story.comments || [],
          createdAt: format(new Date(story.createdAt), "MMMM d, yyyy"),
          showComments: false
        })));
        
        setUser(userRes.data.user);
        setUserId(userRes.data.user?.id);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    socket.on("newStory", (newStory) => {
      setStories(prev => [{
        ...newStory,
        createdAt: format(new Date(newStory.createdAt), "MMMM d, yyyy"),
        showComments: false
      }, ...prev]);
    });

    socket.on("storyLiked", ({ storyId, likes, likedBy }) => {
      setStories(prev => prev.map(story => 
        story._id === storyId ? { ...story, likes, likedBy } : story
      ));
    });

    socket.on("storyCommented", ({ storyId, comment }) => {
      setStories(prev => prev.map(story => 
        story._id === storyId ? { 
          ...story, 
          comments: [...story.comments, comment] 
        } : story
      ));
    });

    return () => {
      socket.off("storyLiked");
      socket.off("storyCommented");
      socket.off("newStory");
    };
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/users/me`);
        setUser(response.data.user);
        setUserId(response.data.user?.id);
      } catch (error) {
        console.error("Error fetching user:", error);
      }
    };

    fetchUser();
  }, []);

  const toggleLike = useCallback(async (storyId) => {
    try {
      const response = await axios.post(`${backendUrl}/api/success-stories/like/${storyId}`);
      if (response.data.success) {
        socket.emit("storyLiked", { 
          storyId, 
          likes: response.data.likes, 
          likedBy: response.data.likedBy 
        });
      }
    } catch (error) {
      console.error("Error liking story:", error);
    }
  }, [backendUrl]);

  const handleCommentSubmit = async (storyId) => {
    const text = commentText[storyId] || "";
    if (typeof text !== "string" || text.trim() === "") return;

    try {
      const commentData = {
        userId: userId,
        userName: user.name,
        text: text.trim(),
      };

      const response = await axios.post(
        `${backendUrl}/api/success-stories/comment/${storyId}`, 
        commentData
      );
      
      if (response.data.success) {
        const newComment = response.data.comment;
        socket.emit("commentStory", { storyId: storyId, comment: newComment });

        setStories((prevStories) =>
          prevStories.map((story) =>
            story._id === storyId
              ? { ...story, comments: [...story.comments, newComment] }
              : story
          )
        );

        setCommentText((prev) => ({
          ...prev,
          [storyId]: "",
        }));
      }
    } catch (error) {
      console.error("Error submitting comment:", error);
    }
  };

  const toggleExpand = (storyId) => {
    setExpandedStories(prev => ({
      ...prev,
      [storyId]: !prev[storyId]
    }));
  };

  const toggleComments = (storyId) => {
    setStories(prev => prev.map(story => 
      story._id === storyId ? { ...story, showComments: !story.showComments } : story
    ));
  };

  const shareStory = (storyId) => {
    const storyUrl = `${window.location.origin}/stories/${storyId}`;
    navigator.clipboard.writeText(storyUrl);
    alert("Story link copied to clipboard!");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center mb-4">
            <FaLeaf className="text-green-600 text-4xl mr-3" />
            <h1 className="text-4xl font-bold text-green-800">
              {t("successStories.title")}
            </h1>
          </div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t("successStories.subtitle")}
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/stories/submit")}
            className="mt-6 bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg shadow-md font-medium transition-all flex items-center mx-auto"
          >
            <FaShareAlt className="mr-2" />
            {t("successStories.shareStoryButton")}
          </motion.button>
        </motion.div>

        {/* Stories Grid */}
        {stories.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm p-8 max-w-2xl mx-auto">
            <div className="bg-green-100 p-4 rounded-full inline-block mb-4">
              <FaLeaf className="text-green-600 text-3xl" />
            </div>
            <h3 className="text-2xl font-medium text-gray-700 mb-2">
              {t("successStories.noStoriesTitle")}
            </h3>
            <p className="text-gray-500 mb-6">
              {t("successStories.noStoriesDescription")}
            </p>
            <button
              onClick={() => navigate("/stories/submit")}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg"
            >
              Be the first to share
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {stories.map((story) => (
              <motion.div
                key={story._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 flex flex-col border border-green-100"
              >
                {/* Story Image */}
                {story.imageUrl && (
                  <div className="h-56 overflow-hidden relative">
                    <img
                      src={story.imageUrl}
                      alt={story.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                      <h2 className="text-xl font-bold text-white">
                        {story.title}
                      </h2>
                    </div>
                  </div>
                )}

                {/* Story Content */}
                <div className="p-6 flex-grow flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center">
                      <div className="bg-green-100 p-2 rounded-full mr-3">
                        <FaUser className="text-green-600" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-700">{story.farmerName}</p>
                        <p className="flex items-center text-xs text-gray-500">
                          <MdDateRange className="mr-1" />
                          {story.createdAt}
                        </p>
                      </div>
                    </div>
                    <button 
                      onClick={() => shareStory(story._id)}
                      className="text-gray-400 hover:text-green-600 transition-colors"
                      title="Share story"
                    >
                      <FaShareAlt />
                    </button>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-gray-600">
                      {expandedStories[story._id] 
                        ? story.description 
                        : `${story.description.substring(0, 150)}${story.description.length > 150 ? "..." : ""}`
                      }
                    </p>
                    {story.description.length > 150 && (
                      <button 
                        onClick={() => toggleExpand(story._id)}
                        className="text-green-600 hover:text-green-800 text-sm font-medium mt-2"
                      >
                        {expandedStories[story._id] ? "Read Less" : "Read More"}
                      </button>
                    )}
                  </div>

                  {/* Stats Bar */}
                  <div className="mt-auto pt-4 border-t border-gray-100 flex justify-between">
                    <button
                      onClick={() => toggleLike(story._id)}
                      className={`flex items-center gap-2 text-sm ${
                        story.likedBy?.includes(userId)
                          ? "text-red-500"
                          : "text-gray-500 hover:text-red-500"
                      }`}
                    >
                      {story.likedBy?.includes(userId) ? (
                        <FaHeart />
                      ) : (
                        <FaRegHeart />
                      )}
                      <span>{story.likes || 0}</span>
                    </button>

                    <button
                      onClick={() => toggleComments(story._id)}
                      className="flex items-center gap-2 text-gray-500 hover:text-green-600 text-sm"
                    >
                      <FaComment />
                      <span>{story.comments?.length || 0}</span>
                    </button>
                  </div>
                </div>

                {/* Comments Section - Only shown when expanded */}
                {story.showComments && (
                  <div className="px-6 pb-6 border-t border-gray-100">
                    <div className="mt-4 mb-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder={t("successStories.commentPlaceholder")}
                          value={commentText[story._id] || ""}
                          onChange={(e) => handleCommentChange(story._id, e.target.value)}
                          className="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 text-sm"
                        />
                        <button
                          onClick={() => handleCommentSubmit(story._id)}
                          className="bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg font-medium text-sm"
                        >
                          Post
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                      {story.comments?.length > 0 ? (
                        story.comments.map((comment, index) => (
                          <div key={index} className="bg-gray-50 p-3 rounded-lg">
                            <div className="flex items-center gap-2 mb-1">
                              <div className="bg-green-100 p-1 rounded-full">
                                <FaUser className="text-green-600 text-xs" />
                              </div>
                              <span className="font-medium text-sm text-gray-700">
                                {comment.userName || "Anonymous"}
                              </span>
                            </div>
                            <p className="text-gray-600 text-sm pl-7">
                              {comment.text}
                            </p>
                          </div>
                        ))
                      ) : (
                        <p className="text-center text-gray-400 text-sm py-2">
                          No comments yet. Be the first to comment!
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessStories;