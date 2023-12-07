const express = require("express");
const router = express.Router();

const user = require("./auth.route");

router.use("/user", user);

module.exports = router;