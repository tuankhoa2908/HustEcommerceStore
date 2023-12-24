const Category = require("../models/blogCategory.model");
const { validateMongoDbId } = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");

module.exports = {
    createCategory: asyncHandler(async (req, res) => {
        try {
            const newCategory = await Category.create(req.body);
            res.json(newCategory);
        } catch (error) {
            throw new Error(error)
        }
    }),

    updateCategory: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id)
        try {
            const updateCategory = await Category.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.json(updateCategory);
        } catch (error) {
            throw new Error(error)
        }
    }),

    deleteCategory: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id)
        try {
            const deleteCategory = await Category.findByIdAndDelete(id);
            res.json(deleteCategory);
        } catch (error) {
            throw new Error(error)
        }
    }),

    getCategory: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const getCategory = await Category.findById(id);
            res.json(getCategory);
        } catch (error) {
            throw new Error(error)
        }
    }),

    getAllCategory: asyncHandler(async (req, res) => {
        try {
            const allCategory = await Category.find();
            res.json(allCategory);
        } catch (error) {
            throw new Error(error)
        }
    })

}