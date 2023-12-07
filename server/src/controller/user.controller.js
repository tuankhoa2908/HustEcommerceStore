const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const bcrypt = require("bcrypt");
const { generateToken } = require("../config/jwtToken");

module.exports = {
    // Create New Accout User
    createUser: asyncHandler(async (req, res) => {
        const data = req.body;
        console.log(data);
        const findUser = await User.findOne({ email: data.email });
        if (!findUser) {
            // Create new user
            const newUser = await User.create(data);
            res.json(newUser)
        }
        else {
            throw new Error("User Already Exists");
        }
    }),

    // Login Account Already
    loginUser: asyncHandler(async (req, res) => {
        const data = req.body;
        console.log(data);
        const findUser = await User.findOne({ email: data.email });
        if (findUser && (await findUser.isPasswordMatched(data.password))) {
            res.json({
                _id: findUser?._id,
                firstname: findUser?.fisrtname,
                lastname: findUser?.lastname,
                email: findUser?.email,
                mobile: findUser?.mobile,
                token: generateToken(findUser?._id),
            });
        }
        else {
            throw new Error("Invalid Credentials");
        }
    }),

    getAllUser: asyncHandler(async (req, res) => {
        try {
            const allUser = await User.find();
            res.json(allUser);
        } catch (error) {
            throw new Error(error)
        }
    }),

    getUser: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const user = await User.findById(id);
            res.json({
                user,
            })
        } catch (error) {
            throw new Error(error)
        }
    }),

    deleteUser: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const deleteUser = await User.findByIdAndDelete(id);
            res.json({
                deleteUser,
            })
        } catch (error) {
            throw new Error(error)
        }
    }),

    updateUser: asyncHandler(async (req, res) => {
        const { id } = req.params;
        try {
            const updateUser = await User.findByIdAndUpdate(
                id,
                {
                    firstname: req?.body?.firstname,
                    lastname: req?.body?.lastname,
                    email: req?.body?.email,
                    mobile: req?.body?.mobile,
                },
                {
                    new: true,
                }
            )
            res.json(updateUser);
        } catch (error) {
            throw new Error(error)
        }
    })
}