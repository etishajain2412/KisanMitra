require("dotenv").config();

module.exports = {
    AGRO_API_KEY: process.env.AGRO_API_KEY,
    MONGO_URI: process.env.MONGO_URI,
    PORT: process.env.PORT || 5000
};
