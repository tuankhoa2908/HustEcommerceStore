const express = require("express");
const router = express.Router();

const { blog } = require("../controller/index.controller");
const middleware = require("../middlewares/authMiddleware");
const uploadImages = require("../middlewares/uploadImages");


router.post("/post", middleware.verifyToken, middleware.isAdmin, blog.createBlog);
router.put("/upimg/:id", middleware.verifyToken, middleware.isAdmin, uploadImages.uploadPhoto.array("images", 4), uploadImages.blogImgResize, blog.uploadImages);
router.put("/update/:id", middleware.verifyToken, middleware.isAdmin, blog.updateBlog);
router.get("/:id", blog.getBlog);
router.get("/", blog.getAllBlog);
router.delete("/:id", middleware.verifyToken, middleware.isAdmin, blog.deleteBlog);
router.put('/likes', middleware.verifyToken, blog.likeBlog);
router.put('/dislikes', middleware.verifyToken, blog.dislikeBlog);

module.exports = router;
