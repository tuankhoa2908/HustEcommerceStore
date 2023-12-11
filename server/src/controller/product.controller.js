const Product = require("../models/product.model");
const asyncHandler = require("express-async-handler");
const slugify = require("slugify");

module.exports = {
    createProduct: asyncHandler(async (req, res) => {
        try {
            if (req.body.title) {
                req.body.slug = slugify(req.body.title);
            }
            const newProduct = await Product.create(req.body);
            res.json(newProduct);
        } catch (error) {
            throw new Error(error);
        }
    }),

    updateProduct: asyncHandler(async (req, res) => {
        const id = req.params.id;
        try {
            if (req.body.title) {
                req.body.slug = slugify(req.body.title);
            }
            const updateProduct = await Product.findByIdAndUpdate(id, req.body,
                {
                    new: true,
                })
            res.json({ updateProduct });
        } catch (error) {
            throw new Error(error);
        }
    }),

    deleteProduct: asyncHandler(async (req, res) => {
        const id = req.params.id;
        try {
            const deleteProduct = await Product.findByIdAndDelete(id);
            res.json({
                message: "Delete product successful"
            });
        } catch (error) {
            throw new Error(error);
        }
    }),

    getProduct: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const product = await Product.findById(id);
            res.json(product)
        } catch (error) {
            throw new Error(error)
        }
    }),

    getAllProducts: asyncHandler(async (req, res) => {
        try {
            const queryObj = { ...req.query };
            // Filter Data 
            const excludeFields = ['page', 'sort', 'limit', 'fields'];
            excludeFields.forEach((el) => {
                delete queryObj[el]
            });
            let queryStr = JSON.stringify(queryObj);
            queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`);
            let query = Product.find(JSON.parse(queryStr));

            // Sort Data
            if (req.query.sort) {
                const sortBy = req.query.sort.split(',').join(" ");
                query = query.sort(sortBy);
            } else {
                query = query.sort("-createAt");
            }

            // limit fields
            if (req.query.fields) {
                const fields = req.query.fields.split(",").join(' ');
                query = query.select(fields);
            } else {
                query = query.select('-__v');
            }

            // pagination
            const page = req.query.page;
            const limit = req.query.limit;
            const skip = (page - 1) * limit;
            query = query.skip(skip).limit(limit);
            if (req.query.page) {
                const productCount = await Product.countDocuments();
                if (skip >= productCount) throw new Error("This page does not exists")
            }

            const allProducts = await query;
            res.json(allProducts);
        } catch (error) {
            throw new Error(error)
        }
    }),
}