const express = require("express");
const {  getPolygonByUser } = require("../controllers/polygonController");

const router = express.Router();




router.post("/get-or-create", getPolygonByUser);


module.exports = router;
