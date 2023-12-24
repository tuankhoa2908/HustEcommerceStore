const express = require("express");
const router = express.Router();

const middleware = require("../middlewares/authMiddleware");
const { color } = require("../controller/index.controller");

router.post("/", middleware.verifyToken, middleware.isAdmin, color.createColor);
router.put("/:id", middleware.verifyToken, middleware.isAdmin, color.updateColor);
router.delete("/:id", middleware.verifyToken, middleware.isAdmin, color.deleteColor);
router.get("/:id", color.getColor);
router.get("/", color.getAllColor);

module.exports = router;