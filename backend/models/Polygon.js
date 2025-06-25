const mongoose = require("mongoose");
const PolygonSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    name: { type: String, required: true },
    coordinates: { type: Array, required: true },
    polygonId: { type: String }
});

module.exports = mongoose.model("Polygon", PolygonSchema);
