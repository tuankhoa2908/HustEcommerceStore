const express = require("express");
const router = express.Router();

const middleware = require("../middlewares/authMiddleware");
const { blogCategory } = require("../controller/index.controller");

router.post("/", middleware.verifyToken, middleware.isAdmin, blogCategory.createCategory);
router.put("/:id", middleware.verifyToken, middleware.isAdmin, blogCategory.updateCategory);
router.delete("/:id", middleware.verifyToken, middleware.isAdmin, blogCategory.deleteCategory);
router.get("/:id", blogCategory.getCategory);
router.get("/", blogCategory.getAllCategory);



module.exports = router;