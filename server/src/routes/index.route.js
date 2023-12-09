const express = require("express");
const router = express.Router();

const user = require("./auth.route");
const product = require("./product.route");

router.use("/user", user);
router.use("/product", product);


module.exports = router;