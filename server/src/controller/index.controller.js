const controllers = {};

controllers.user = require("./user.controller");
controllers.product = require("./product.controller");
controllers.blog = require("./blog.controller");

module.exports = controllers;