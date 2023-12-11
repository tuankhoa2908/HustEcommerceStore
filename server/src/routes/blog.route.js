const express = require("express");
const router = express.Router();

const { blog } = require("../controller/index.controller");
const middleware = require("../middlewares/authMiddleware");


router.post("/post", middleware.verifyToken, middleware.isAdmin, blog.createBlog);
router.put("/update/:id", middleware.verifyToken, middleware.isAdmin, blog.updateBlog);
router.get("/:id", blog.getBlog);
router.get("/", blog.getAllBlog);
router.delete("/:id", middleware.verifyToken, middleware.isAdmin, blog.deleteBlog);

module.exports = router;
