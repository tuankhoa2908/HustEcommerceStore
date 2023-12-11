const express = require("express");
const router = express.Router();

const user = require("./auth.route");
const product = require("./product.route");
const blog = require("./blog.route");

router.use("/user", user);
router.use("/product", product);
router.use("/blog", blog);


module.exports = router;