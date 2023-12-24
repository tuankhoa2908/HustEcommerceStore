const express = require("express");
const router = express.Router();

const user = require("./auth.route");
const product = require("./product.route");
const blog = require("./blog.route");
const prodCategory = require("./prodCategory.route");
const blogCategory = require("./blogCategory.route");
const brand = require("./brand.route");
const coupon = require("./coupon.route");
const color = require("./color.route");
const enquiry = require("./enquiry.route");

router.use("/user", user);
router.use("/product", product);
router.use("/blog", blog);
router.use("/prodcategory", prodCategory);
router.use("/blogcategory", blogCategory);
router.use("/brand", brand);
router.use("/coupon", coupon);
router.use("/color", color);
router.use("/enquiry", enquiry);

module.exports = router;