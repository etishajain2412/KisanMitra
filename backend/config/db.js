const mongoose = require("mongoose");
const { MONGO_URI } = require("./dotenvConfig");

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI, {
            dbName: "kisanmitra",
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("MongoDB Connected to kisanmitra");
    } catch (error) {
        console.error("MongoDB Connection Failed:", error);
        process.exit(1);
    }
};

module.exports = connectDB;
