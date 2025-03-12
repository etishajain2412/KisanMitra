const ForumPost = require("../models/ForumPost");

// ✅ Debug: Check if io is available

exports.createForum=async(req,res)=>{
    try {
        console.log("🔍 Received request to create post:", req.body);  // ✅ Log request data
        const { userId, userName, question } = req.body;
        if (!userId || !userName || !question) {
            console.log("❌ Missing fields in request");  // ✅ Log missing fields
            return res.status(400).json({ error: "Missing required fields" });
        }

        const post = new ForumPost({ userId, userName, question });
        await post.save();
        console.log("✅ Forum post saved:", post)
        res.status(201).json(post);
    } catch (error) {
        console.error("❌ Error creating forum post:", error);  
        res.status(500).json({ error: "Error creating forum post" });
    }
};

exports.getForums=async(req,res)=>{
    try {
        const posts = await ForumPost.find().sort({ createdAt: -1 });
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ error: "Error fetching posts" });
    }
};

exports.answer= async(req,res)=>{
    try {
        console.log("🔍 Received Answer Request:", req.body); 
        const { userId, userName, answer } = req.body;
        if (!userId || !userName || !answer) {
            console.log("❌ Missing fields in answer request");  // ✅ Log missing fields
            return res.status(400).json({ error: "Missing required fields" });
        }
        const post = await ForumPost.findById(req.params.postId);
        console.log(`post founf on db: ${post}`);
        if (!post) return res.status(404).json({ error: "Post not found" });

       // ✅ Save Answer to Database
       const newAnswer = { userId, userName, answer, createdAt: new Date() };
       post.answers.push(newAnswer);
       await post.save();

       console.log("✅ Answer added successfully:", post.answers);
       // ✅ Emit Answer Update to All Clients
        // ✅ Debug: Check if io is working before emitting event
        if (global.io) {
            console.log("📢 Emitting answerBroadcast...");
            global.io.emit("answerBroadcast", { postId: req.params.postId, answer: newAnswer });
            console.log("✅ answerBroadcast event emitted successfully");
        } else {
            console.error("❌ io is not defined. Answer was not broadcasted.");
        }
        res.status(200).json(post);
    } catch (error) {
        res.status(500).json({ error: "Error adding answer" });
    }
};