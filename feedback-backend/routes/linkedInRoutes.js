const express = require("express");
const { LinkedCallBack } = require("../api/controller/authcontroller");

const router = express.Router();

// Make sure this matches your frontend redirect_uri exactly
router.get("/callback", LinkedCallBack);

module.exports = router;
