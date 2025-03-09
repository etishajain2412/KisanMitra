const express = require("express");
const {  getPolygonByUser } = require("../controllers/polygonController");
const verifyToken = require('../middlewares/verifyToken.js');

const router = express.Router();




router.post("/get-or-create", verifyToken, getPolygonByUser);


module.exports = router;
