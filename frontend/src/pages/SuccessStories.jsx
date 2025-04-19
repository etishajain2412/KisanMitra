import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { FaHeart, FaRegHeart, FaCommentDots } from "react-icons/fa";
import { useTranslation } from "react-i18next";
axios.defaults.withCredentials = true;

const socket = io("http://localhost:5000");

const SuccessStories = () => {
  const { t } = useTranslation();

  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
  const [stories, setStories] = useState([]);
  const [commentText, setCommentText] = useState({});
  const [showComments, setShowComments] = useState({});
  const [user, setUser] = useState(null);
  const [userId, setUserId] = useState(null);

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

  const toggleLike = useCallback(
    async (storyId) => {
      try {
        const response = await axios.post(`${backendUrl}/api/success-stories/like/${storyId}`);
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
    },
    [userId, backendUrl]
  );

  const handleCommentSubmit = async (storyId) => {
    const text = commentText[storyId] || "";
    if (typeof text !== "string" || text.trim() === "") return;

    try {
      const commentData = {
        userId: userId,
        userName: user.name,
        text: text,
      };

      const response = await axios.post(`${backendUrl}/api/success-stories/comment/${storyId}`, commentData);
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
    <div className="container mx-auto px-4 mt-8">
      <h1 className="text-center text-3xl font-semibold mb-6">{t("successStories.title")}</h1>

      <div className="text-center mb-6">
        <button
          onClick={() => navigate("/stories/submit")}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
        >
          {t("successStories.shareStoryButton")}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {stories.length === 0 ? (
          <p className="text-center col-span-full">{t("successStories.noStories")}</p>
        ) : (
          stories.map((story) => (
            <div key={story._id} className="bg-white shadow rounded-lg overflow-hidden flex flex-col h-full">
              {story.imageUrl && (
                <img src={story.imageUrl} alt="Story" className="w-full h-64 object-cover" />
              )}
              <div className="p-4 flex-grow">
                <h2 className="text-xl font-semibold">{story.title}</h2>
                <p className="text-gray-500 mb-2">👤 {story.farmerName}</p>
                <p>{story.description}</p>
              </div>
              <div className="p-4 border-t flex justify-between items-center">
                <button
                  onClick={() => toggleLike(story._id)}
                  className={`flex items-center gap-1 px-3 py-1 rounded ${
                    Array.isArray(story.likedBy) && story.likedBy.includes(userId)
                      ? "bg-red-600 text-white"
                      : "border border-red-600 text-red-600 hover:bg-red-600 hover:text-white"
                  }`}
                >
                  {Array.isArray(story.likedBy) && story.likedBy.includes(userId) ? (
                    <FaHeart />
                  ) : (
                    <FaRegHeart />
                  )}
                  {story.likes} {t("successStories.like")}
                </button>

                <button
                  onClick={() => toggleComments(story._id)}
                  className="flex items-center gap-1 border border-gray-400 text-gray-600 hover:bg-gray-100 px-3 py-1 rounded"
                >
                  <FaCommentDots />
                  {showComments[story._id] ? t("successStories.hideComments") : t("successStories.showComments")}
                </button>
              </div>

              {showComments[story._id] && (
                <div className="p-4 border-t bg-gray-50">
                  <input
                    type="text"
                    placeholder="Write a comment..."
                    value={commentText[story._id] || ""}
                    onChange={(e) => handleCommentChange(story._id, e.target.value)}
                    className="w-full p-2 border rounded mb-2"
                  />
                  <button
                    onClick={() => handleCommentSubmit(story._id)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                  >
                    Comment
                  </button>

                  <div className="mt-4 space-y-2">
                    {story.comments.map((comment, index) => (
                      <div key={index} className="text-sm">
                        <strong>{comment.userName || "Anonymous"}:</strong> {comment.text}
                      </div>
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
