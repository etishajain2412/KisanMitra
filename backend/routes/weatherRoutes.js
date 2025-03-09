const express = require("express");
const {getWeatherAndNDVI} =require ("../controllers/weatherController");
const verifyToken = require('../middlewares/verifyToken.js');

const router = express.Router();
router.get("/:userId",verifyToken, getWeatherAndNDVI);
module.exports = router;