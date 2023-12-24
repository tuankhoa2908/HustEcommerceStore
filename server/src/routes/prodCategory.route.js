const express = require("express");
const router = express.Router();

const middleware = require("../middlewares/authMiddleware");
const { prodCategory } = require("../controller/index.controller");

router.post("/", middleware.verifyToken, middleware.isAdmin, prodCategory.createCategory);
router.put("/:id", middleware.verifyToken, middleware.isAdmin, prodCategory.updateCategory);
router.delete("/:id", middleware.verifyToken, middleware.isAdmin, prodCategory.deleteCategory);
router.get("/:id", prodCategory.getCategory);
router.get("/", prodCategory.getAllCategory);

module.exports = router;