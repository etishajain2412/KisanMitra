import React, { useEffect, useState } from "react";
import axios from "axios";
import io from "socket.io-client";
import { FaComment, FaPlus, FaReply } from "react-icons/fa";

const socket = io("http://localhost:5000"); 
const Forum = () => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";
    const [posts, setPosts] = useState([]);
    const [newQuestion, setNewQuestion] = useState("");
     const [userId, setUserId] = useState(null);
     const [answers, setAnswers] = useState({}); // Store answers for each post
     const [loading, setLoading] = useState(true);
     useEffect(() => {
        // Get token from localStorage
        const fetchUser = async () => {
            try {
                const response = await axios.get(`${backendUrl}/api/users/me`, {
                    withCredentials: true,
                });

                const user = response.data.user;
                console.log("👤 Logged-in user:", user);

                setUserId(user);
               
            } catch (error) {
                console.error("Error fetching user:", error);
            }
        };

        fetchUser();
       
      }, []);

      // ✅ Fetch initial forum posts
   useEffect(() => {
       axios.get(`${backendUrl}/api/forum`)
           .then((response) => setPosts(response.data))
           .catch((error) => console.error("Error fetching posts:", error));
   }, []);
      // ✅ Listen for real-time updates
      useEffect(() => {
        socket.on("messageBroadcast", (messageData) => {
            setPosts(prevPosts => {
                const updatedPosts = [...prevPosts, messageData];
                const uniquePosts = Array.from(new Set(updatedPosts.map(post => post._id)))
                                        .map(id => updatedPosts.find(post => post._id === id));
                return uniquePosts;
            });
        });

        socket.on("answerBroadcast", ({ postId, answer }) => {
            console.log("📩 New Answer Received:", answer);

            setPosts(prevPosts =>
                prevPosts.map(post =>
                    post._id === postId ? { ...post, answers: [...post.answers, answer] } : post
                )
            );
        });
    
        return () => {
            socket.off("messageBroadcast");
            socket.off("answerBroadcast");
        };
    }, []);
    

      

    const handlePostQuestion = () => {
        console.log("📤 Sending request:", { userId: userId._id, userName: userId.name, question: newQuestion });
        axios.post(`${backendUrl}/api/forum/create`, {
            userId: userId._id, // Replace with logged-in user
            userName: userId.name,
            question: newQuestion,
        }).then(response => {
            setPosts([response.data, ...posts]);
            setNewQuestion("");
            socket.emit("newMessage", response.data); // ✅ Send real-time update
        }).catch(error => console.error("Error posting:", error));
    };


    const handleAnswerSubmit = (postId) => {
        axios.post(`${backendUrl}/api/forum/answer/${postId}`, {
            userId: userId._id, 
            userName: userId.name,
            answer: answers[postId] || "",
            withCredentials: true,
        }).then(response => {
            setPosts(posts.map(post => post._id === postId ? response.data : post));
            setAnswers({ ...answers, [postId]: "" });
            socket.emit("newAnswer", { postId, answer: { 
                userId: userId._id,
                userName: userId.name,
                answer: answers[postId] || ""
            }});
        }).catch(error => console.error("Error submitting answer:", error));
    };
    console.log("🔍 Posts Data:", posts);

    return (
        <div className="forum-container">
            <h2>💬 Farmer Discussion Forum</h2>

            {/* New Question Section */}
            <div className="new-post">
                <input
                    type="text"
                    placeholder="Ask a question..."
                    value={newQuestion}
                    onChange={(e) => setNewQuestion(e.target.value)}
                />
                <button onClick={handlePostQuestion}>
                    <FaPlus /> Post
                </button>
            </div>

            {/* Forum Posts */}
            <ul className="posts">
                {posts.map((post) => (
                    <li key={`${post._id}-${post.createdAt}`} className="post-item">
                        <h4>{post.userName}</h4>
                        <p>{post.question}</p>
                        <p>💬 {post.answers.length} answers</p>

                        {/* Answer Section */}
                        <div className="answer-section">
                            <input
                                type="text"
                                placeholder="Write an answer..."
                                value={answers[post._id] || ""}
                                onChange={(e) => setAnswers({ ...answers, [post._id]: e.target.value })}
                            />
                            <button onClick={() => handleAnswerSubmit(post._id)}>
                                <FaReply /> Answer
                            </button>
                        </div>

                        {/* Display Answers */}
                        <ul className="answers-list">
                            {post.answers.map((ans, index) => (
                                <li key={index} className="answer-item">
                                    <strong>{ans.userName}:</strong> {ans.answer}
                                </li>
                            ))}
                        </ul>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Forum;