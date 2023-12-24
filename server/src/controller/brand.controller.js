const Brand = require("../models/brand.model");
const { validateMongoDbId } = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");

module.exports = {
    createBrand: asyncHandler(async (req, res) => {
        try {
            const newBrand = await Brand.create(req.body);
            res.json(newBrand);
        } catch (error) {
            throw new Error(error)
        }
    }),

    updateBrand: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id)
        try {
            const updateBrand = await Brand.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.json(updateBrand);
        } catch (error) {
            throw new Error(error)
        }
    }),

    deleteBrand: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id)
        try {
            const deleteBrand = await Brand.findByIdAndDelete(id);
            res.json(deleteBrand);
        } catch (error) {
            throw new Error(error)
        }
    }),

    getBrand: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const getBrand = await Brand.findById(id);
            res.json(getBrand);
        } catch (error) {
            throw new Error(error)
        }
    }),

    getAllBrand: asyncHandler(async (req, res) => {
        try {
            const allBrand = await Brand.find();
            res.json(allBrand);
        } catch (error) {
            throw new Error(error)
        }
    })

}