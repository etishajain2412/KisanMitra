const axios = require("axios");
const mongoose = require("mongoose"); 

const Polygon = require("../models/Polygon"); // Import Polygon model
const { AGRO_API_KEY } = require("../config/dotenvConfig");

exports.getPolygonByUser = async (req, res) => {
    console.log("🔑 AGRO_API_KEY:", AGRO_API_KEY);

    console.log(req.body);
    const { userId, lat, lon } = req.body;
  
    console.log(`🟢 Step 1: Received request with userId: ${userId}, lat: ${lat}, lon: ${lon}`);

   // console.log(`at controller getPolygon ${lat}, ${lon}`)
    
    try {
        if (!userId || (userId.length !== 24 && !mongoose.isValidObjectId(userId))) {
            return res.status(400).json({ error: "Invalid userId format" });
        }
        if (!lat || !lon) {
            return res.status(400).json({ error: "Latitude and Longitude are required" });
        }
      
        console.log("🟢 Step 2: Checking if polygon exists in MongoDB...");

        const query = mongoose.isValidObjectId(userId) ? { userId: new mongoose.Types.ObjectId(userId) } : { userId };


        let polygon = await Polygon.findOne(query);
       
        console.log(`Polygon search result: ${polygon}`);

        if (!polygon) {
            console.log("🟢 Step 3: No polygon found, creating one...");

            // Create a small square polygon around the user's location
            const coordinates = [
                [lon - 0.01, lat - 0.01],
                [lon + 0.01, lat - 0.01],
                [lon + 0.01, lat + 0.01],
                [lon - 0.01, lat + 0.01],
                [lon - 0.01, lat - 0.01]
            ];

            const polygonData = {
                name: `User_${userId}_Polygon`,
                geo_json: {
                    type: "Feature",
                    properties: {},
                    geometry: {
                        type: "Polygon",
                        coordinates: [coordinates]
                    }
                }
            };
            console.log(`Saving polygon data ${JSON.stringify(polygonData)}`);
            console.log("🟢 Step 4: Sending data to Agromonitoring API...");

            const response = await axios.post(
                `https://api.agromonitoring.com/agro/1.0/polygons?appid=${AGRO_API_KEY}`,
                polygonData,
                {timeout:10000}
            );
            console.log("Agromonitoring API Response:", response.data);

            polygon = new Polygon({
                userId,
                name: `User_${userId}_Polygon`,
                coordinates,
                polygonId: response.data.id
            });

            await polygon.save();
            console.log("Polygon saved in MongoDB.");
        }

        res.json(polygon);
    } catch (error) {
        res.status(500).json({ error: error.response?.data || error.message });
    }
};
