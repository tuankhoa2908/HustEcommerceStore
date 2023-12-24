const Color = require("../models/color.model");
const { validateMongoDbId } = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");

module.exports = {
    createColor: asyncHandler(async (req, res) => {
        try {
            const newColor = await Color.create(req.body);
            res.json(newColor);
        } catch (error) {
            throw new Error(error)
        }
    }),

    updateColor: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id)
        try {
            const updateColor = await Color.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.json(updateColor);
        } catch (error) {
            throw new Error(error)
        }
    }),

    deleteColor: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id)
        try {
            const deleteColor = await Color.findByIdAndDelete(id);
            res.json(deleteColor);
        } catch (error) {
            throw new Error(error)
        }
    }),

    getColor: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const getColor = await Color.findById(id);
            res.json(getColor);
        } catch (error) {
            throw new Error(error)
        }
    }),

    getAllColor: asyncHandler(async (req, res) => {
        try {
            const allColor = await Color.find();
            res.json(allColor);
        } catch (error) {
            throw new Error(error)
        }
    })

}