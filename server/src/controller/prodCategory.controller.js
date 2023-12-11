const Category = require("../models/category.model");
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
}