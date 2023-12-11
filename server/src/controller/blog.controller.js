const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const { validateMongoDbId } = require("../utils/validateMongodbId");

module.exports = {
    createBlog: asyncHandler(async (req, res) => {
        try {
            const newBlog = await Blog.create(req.body);
            res.json({
                status: "success",
                newBlog
            })
        } catch (error) {
            throw new Error(error)
        }
    }),

    deleteBlog: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const deleteBlog = await Blog.findByIdAndDelete(id, req.body, {
                new: true,
            });
            res.json({
                message: "Delete Blog Successful",
                deleteBlog
            })
        } catch (error) {
            throw new Error(error)
        }
    }),

    getBlog: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const blog = await Blog.findById(id).populate("likes").populate("dislikes");
            const updateViews = await Blog.findByIdAndUpdate(id, {
                $inc: { numViews: 1 }
            }, {
                new: true,
            });
            res.json({ blog })
        } catch (error) {
            throw new Error(error)
        }
    }),

    getAllBlog: asyncHandler(async (req, res) => {
        try {
            const Allblogs = await Blog.find();
            res.json({ Allblogs })
        } catch (error) {
            throw new Error(error)
        }
    }),

    updateBlog: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const deleteBlog = await Blog.findByIdAndUpdate(id);
            res.json({ deleteBlog })
        } catch (error) {
            throw new Error(error)
        }
    }),

    likeBlog: asyncHandler(async (req, res) => {
        const { blogId } = req.body;
        validateMongoDbId(blogId);
        // Find the blog which you want to be liked
        const blog = await Blog.findById(blogId);
        // find the login user
        const loginUserId = req?.user?._id;
        // find if the user has liked the blog
        const isLiked = blog?.isLiked;
        // find if the user has disliked the blog
        const alreadyDislike = blog?.dislikes?.find(
            (userId) => userId?.toString() === loginUserId?.toString()
        );
        if (alreadyDislike) {
            const blog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $pull: { dislikes: loginUserId },
                    isDislike: false,
                },
                { new: true }
            );
            res.json(blog);
        }
        if (isLiked) {
            const blog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $pull: { likes: loginUserId },
                    isLiked: false,
                },
                { new: true }
            );
            res.json(blog);
        } else {
            const blog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $push: { likes: loginUserId },
                    isLiked: true,
                },
                { new: true }
            );
            res.json(blog);
        }
    }),

    dislikeBlog: asyncHandler(async (req, res) => {
        const { blogId } = req.body;
        validateMongoDbId(blogId);
        // Find the blog which you want to be liked
        const blog = await Blog.findById(blogId);
        // find the login user
        console.log(blog);
        const loginUserId = req?.user?._id;
        // find if the user has liked the blog
        const isDisLiked = blog.isDislike;
        console.log(isDisLiked);
        // find if the user has disliked the blog
        const alreadyLiked = blog?.likes?.find(
            (userId) => userId?.toString() === loginUserId?.toString()
        );
        if (alreadyLiked) {
            const blog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $pull: { likes: loginUserId },
                    isLiked: false,
                },
                { new: true }
            );
            res.json(blog);
        }
        if (isDisLiked) {
            const blog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $pull: { dislikes: loginUserId },
                    isDislike: false,
                },
                { new: true }
            );
            res.json(blog);
        } else {
            const blog = await Blog.findByIdAndUpdate(
                blogId,
                {
                    $push: { dislikes: loginUserId },
                    isDislike: true,
                },
                { new: true }
            );
            res.json(blog);
        }
    }),
}