const User = require("../models/user.model");
const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken")
const { validateMongoDbId } = require("../utils/validateMongodbId");

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
        const findUser = await User.findOne({ email: data.email });
        if (findUser && (await findUser.isPasswordMatched(data.password))) {
            const refreshToken = await generateRefreshToken(findUser?._id);
            const updateUser = await User.findByIdAndUpdate(findUser._id, {
                refreshToken: refreshToken,
            }, {
                new: true,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            })
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

    // handle refresh token
    handleRefreshToken: asyncHandler(async (req, res) => {
        const cookie = req.cookies;
        if (!cookie) throw new Error("No Refresh Token in cookies");
        const refreshToken = cookie.refreshToken;
        const user = await User.findOne({ refreshToken })
        if (!user) throw new Error("No Refresh token present in db or not matched");
        jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
            if (err || user.id !== decoded.id) {
                throw new Error("There is something wrong with refresh token");
            }
            const accessToken = generateToken(user?._id);
            res.json({ accessToken });
        })
    }),

    // dang xuat tai khoan nguoi dung
    logoutUser: asyncHandler(async (req, res) => {
        console.log(1);
        const cookie = req.cookies;
        if (!cookie?.refreshToken) throw new Error("No Refresh Token in cookies");
        const refreshToken = cookie.refreshToken;
        const user = await User.findOne({ refreshToken });
        if (!user) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: true,
            });
            return res.sendStatus(204);
        };
        await User.findOneAndUpdate({ refreshToken }, {
            refreshToken: "",
        });
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true,
        });
        return res.sendStatus(204);
    }),

    // lay thong tin ve tat ca tai khoan
    getAllUser: asyncHandler(async (req, res) => {
        try {
            const allUser = await User.find();
            res.json(allUser);
        } catch (error) {
            throw new Error(error)
        }
    }),

    // lay thong tin ve 1 tai khoan
    getUser: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id);
        try {
            const user = await User.findById(id);
            res.json({
                user,
            })
        } catch (error) {
            throw new Error(error)
        }
    }),

    // xoa tai khoan
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

    // cap nhat thong tin tai khoan
    updateUser: asyncHandler(async (req, res) => {
        const { id } = req.user;
        validateMongoDbId(id);
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
    }),

    //khoa tai khoan nguoi dung
    blockUser: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id);
        try {
            const blockUser = await User.findByIdAndUpdate(
                id,
                {
                    isBlocked: true,
                },
                {
                    new: true,
                }
            )
            res.json({
                message: `User ${blockUser.email} had blocked`,
                blockUser
            })
        } catch (error) {
            throw new Error(error)
        }
    }),

    // mo khoa tai khoan nguoi dung
    unblockUser: asyncHandler(async (req, res) => {
        const { id } = req.params;
        validateMongoDbId(id);
        try {
            const unblockUser = await User.findByIdAndUpdate(
                id,
                {
                    isBlocked: false,
                },
                {
                    new: true,
                }
            )
            res.json({
                unblockUser
            })
        } catch (error) {
            throw new Error(error)
        }
    }),
}