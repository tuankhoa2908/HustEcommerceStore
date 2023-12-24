const controllers = {};

controllers.user = require("./user.controller");
controllers.product = require("./product.controller");
controllers.blog = require("./blog.controller");
controllers.prodCategory = require("./prodCategory.controller");
controllers.blogCategory = require("./blogCategory.controller");
controllers.brand = require("./brand.controller");
controllers.coupon = require("./coupon.controller");
controllers.color = require("./color.controller");
controllers.enquiry = require("./enq.controller");

module.exports = controllers;