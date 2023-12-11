const express = require("express");
const router = express.Router();

const middleware = require("../middlewares/authMiddleware");
const { category } = require("../controller/index.controller");

router.post("/", middleware.verifyToken, middleware.isAdmin, category.createCategory);


module.exports = router;