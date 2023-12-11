const controllers = {};

controllers.user = require("./user.controller");
controllers.product = require("./product.controller");
controllers.blog = require("./blog.controller");
controllers.category = require("./prodCategory.controller");

module.exports = controllers;