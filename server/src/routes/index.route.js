const express = require("express");
const router = express.Router();

const user = require("./auth.route");
const product = require("./product.route");
const blog = require("./blog.route");
const category = require("./prodCategory.route");

router.use("/user", user);
router.use("/product", product);
router.use("/blog", blog);
router.use("/category", category);

module.exports = router;