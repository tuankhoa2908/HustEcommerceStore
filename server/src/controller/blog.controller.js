const Blog = require("../models/blog.model");
const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const validateMongoDbId = require("../utils/validateMongodbId");

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
            const deleteBlog = await Blog.findByIdAnddelete(id, req.body, {
                new: true,
            });
            res.json({ deleteBlog })
        } catch (error) {
            throw new Error(error)
        }
    }),

    getBlog: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const blog = await Blog.findById(id);
            await Blog.findByIdAnddUpdate(id, {
                $inc: { numViews: 1 }
            }, {
                new: true,
            })
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

    deleteBlog: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const deleteBlog = await Blog.findByIdAndUpdate(id);
            res.json({ deleteBlog })
        } catch (error) {
            throw new Error(error)
        }
    }),

}