const Product = require("../models/product.model");
const User = require("../models/user.model");

const asyncHandler = require("express-async-handler");
const slugify = require("slugify");
const fs = require("fs");
const { validateMongoDbId } = require("../utils/validateMongodbId");
const cloudinary = require("../utils/cloudinary");

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

    addToWishList: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { prodId } = req.body;
        try {
            const user = await User.findById(_id);
            const alreadyAdded = user.wishList.find((id) => id.toString() === prodId);
            if (alreadyAdded) {
                let user = await User.findByIdAndUpdate(_id, {
                    $pull: { wishList: prodId }
                }, {
                    new: true,
                })
                res.json(user);
            } else {
                let user = await User.findByIdAndUpdate(_id, {
                    $push: { wishList: prodId }
                }, {
                    new: true,
                })
                res.json(user);
            }
        } catch (error) {
            throw new Error(error)
        }
    }),

    rating: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { star, prodId, comment } = req.body;
        console.log(req.body);
        try {
            const product = await Product.findById(prodId);
            console.log(product)
            let alreadyRated = product.ratings.find((userId) => userId.postedBy.toString() === _id.toString());
            console.log(alreadyRated);
            if (alreadyRated) {
                const updateRating = await Product.updateOne(
                    { ratings: { $elemMatch: alreadyRated } },
                    {
                        $set: { "ratings.$.star": star, "ratings.$.comment": comment }
                    },
                    {
                        new: true
                    }
                )
            } else {
                const rateProduct = await Product.findByIdAndUpdate(prodId,
                    {
                        $push: {
                            ratings: {
                                star: star,
                                comment: comment,
                                postedBy: _id,
                            }
                        }
                    }, {
                    new: true,
                })
            }
            const getAllRating = await Product.findById(prodId);
            let totalRating = getAllRating.ratings.length;
            let ratingsum = getAllRating.ratings.map((item) => item.star).reduce((prev, curr) => prev + curr, 0);
            let actualRating = Math.round(ratingsum / totalRating);
            let finalProduct = await Product.findByIdAndUpdate(prodId, {
                totalRating: actualRating,
            }, {
                new: true,
            })
            res.json(finalProduct);
        } catch (error) {
            throw new Error(error)
        }
    }),

    uploadImages: asyncHandler(async (req, res) => {
        try {
            const uploader = (path) => cloudinary.cloudinaryUploadImg(path, "images");
            const urls = [];
            const files = req.files;
            for (const file of files) {
                const { path } = file;
                const newpath = await uploader(path);
                urls.push(newpath);
                // fs.unlinkSync(path)
            }
            const images = urls.map((file) => {
                return file;
            })
            res.json(images)
        } catch (error) {
            throw new Error(error)
        }
    }),

    deleteImages: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const deleted = cloudinary.cloudinaryDeleteImg(id, "images");
            res.json({ message: "Deleted" })
        } catch (error) {
            throw new Error(error)
        }
    })
}