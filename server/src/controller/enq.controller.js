const Enquiry = require("../models/enquiry.model");
const { validateMongoDbId } = require("../utils/validateMongodbId");
const asyncHandler = require("express-async-handler");

module.exports = {
    createEnquiry: asyncHandler(async (req, res) => {
        try {
            const newEnquiry = await Enquiry.create(req.body);
            res.json(newEnquiry);
        } catch (error) {
            throw new Error(error)
        }
    }),

    updateEnquiry: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id)
        try {
            const updateEnquiry = await Enquiry.findByIdAndUpdate(id, req.body, {
                new: true,
            });
            res.json(updateEnquiry);
        } catch (error) {
            throw new Error(error)
        }
    }),

    deleteEnquiry: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id)
        try {
            const deleteEnquiry = await Enquiry.findByIdAndDelete(id);
            res.json(deleteEnquiry);
        } catch (error) {
            throw new Error(error)
        }
    }),

    getEnquiry: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const getEnquiry = await Enquiry.findById(id);
            res.json(getEnquiry);
        } catch (error) {
            throw new Error(error)
        }
    }),

    getAllEnquiry: asyncHandler(async (req, res) => {
        try {
            const allEnquiry = await Enquiry.find();
            res.json(allEnquiry);
        } catch (error) {
            throw new Error(error)
        }
    })

}