const User = require("../models/user.model");
const Product = require("../models/product.model");
const Cart = require("../models/cart.model");
const Coupon = require("../models/coupon.model");
const Order = require("../models/order.model");

const asyncHandler = require("express-async-handler");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const uniqid = require("uniqid");

const { generateToken } = require("../config/jwtToken");
const { generateRefreshToken } = require("../config/refreshToken")
const { validateMongoDbId } = require("../utils/validateMongodbId");
const { sendEmail } = require("./email.controller");
const { get } = require("http");


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
            const refreshToken = generateRefreshToken(findUser?._id);
            await User.findByIdAndUpdate(findUser._id, {
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
                firstname: findUser?.firstname,
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

    loginAdmin: asyncHandler(async (req, res) => {
        const data = req.body;
        const findAdmin = await User.findOne({ email: data.email });
        if (findAdmin.role !== "admin") throw new Error("Not Authorised");
        if (findAdmin && (await findAdmin.isPasswordMatched(data.password))) {
            const refreshToken = generateRefreshToken(findAdmin?._id);
            await User.findByIdAndUpdate(findAdmin._id, {
                refreshToken: refreshToken,
            }, {
                new: true,
            });
            res.cookie("refreshToken", refreshToken, {
                httpOnly: true,
                maxAge: 72 * 60 * 60 * 1000,
            })
            res.json({
                _id: findAdmin?._id,
                firstname: findAdmin?.firstname,
                lastname: findAdmin?.lastname,
                email: findAdmin?.email,
                mobile: findAdmin?.mobile,
                token: generateToken(findAdmin?._id),
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

    forgotPasswordToken: asyncHandler(async (req, res) => {
        const { email } = req.body;
        console.log(email);
        const user = await User.findOne({ email });
        if (!user) throw new Error("User not found with this email");
        try {
            const token = await user.createPasswordResetToken();
            await user.save();
            const resetURL = `Hi, please follow the link to reset your Password. This link is valid till 10 minutes from now. <a href='http://localhost:8080/api/user/reset-password/${token}'>Click Here</a>`
            const data = {
                to: email,
                subject: "Forgot Password Link",
                html: resetURL,
                text: "Hey User",
            };
            sendEmail(data);
            res.json({ token })
        } catch (error) {
            throw new Error(error);
        }
    }),

    resetPassword: asyncHandler(async (req, res) => {
        const { password } = req.body;
        const { token } = req.params;
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
        const user = await User.findOne({
            passwordResetToken: hashedToken,
            passwordResetExpires: { $gt: Date.now() },
        })
        if (!user) throw new Error("Token Expired, Please try again later");
        user.password = password;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();
        res.json({ user });
    }),

    changePassword: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        const { password } = req.body;
        validateMongoDbId(_id);
        const user = await User.findById(_id);
        if (password) {
            user.password = password;
            const updatePassword = await user.save();
            res.json(updatePassword);
        }
        else {
            res.json(user);
        }
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

    saveAddress: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        validateMongoDbId(_id);
        try {
            const updateUser = await User.findByIdAndUpdate(_id, {
                address: req?.body?.address,
            }, {
                new: true
            });
            res.json(updateUser);
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

    getWishList: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        try {
            const findUser = await User.findById(_id).populate("wishList");
            res.json(findUser);
        } catch (error) {
            throw new Error(error)
        }
    }),

    userCart: asyncHandler(async (req, res, next) => {
        const { cart } = req.body;
        const { _id } = req.user;
        validateMongoDbId(_id);
        try {
            let products = [];
            const user = await User.findById(_id);
            const alreadyExistCart = await Cart.findOne({ orderBy: user._id });
            if (alreadyExistCart) {
                alreadyExistCart.remove();

            }
            for (let i = 0; i < cart.length; i++) {
                let object = {};
                object.product = cart[i]._id;
                object.count = cart[i].count;
                object.color = cart[i].color;
                let getPrice = await Product.findById(cart[i]._id).select('price').exec();
                object.price = getPrice.price;
                products.push(object);
            }
            let cartTotal = 0;
            for (let i = 0; i < products.length; i++) {
                cartTotal += products[i].price * products[i].count;
            }
            console.log(products);
            let newCart = await new Cart({
                products,
                cartTotal,
                orderBy: user?._id,
            }).save();
            res.json(newCart);
        } catch (error) {
            throw new Error(error)
        }
    }),

    getUserCart: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        validateMongoDbId(_id);
        try {
            const cart = await Cart.findOne({ orderBy: _id }).populate("products.product");
            res.json(cart);
        } catch (error) {
            throw new Error(error);
        }
    }),

    emptyCart: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        validateMongoDbId(_id);
        try {
            const user = await User.findById(_id);
            const cart = await Cart.findOneAndDelete({ orderBy: user._id });
            res.json(cart);
        } catch (error) {
            throw new Error(error);
        }
    }),

    applyCoupon: asyncHandler(async (req, res) => {
        const { coupon } = req.body;
        const { _id } = req.user;
        console.log(_id);
        const validCoupon = await Coupon.findOne({ name: coupon });
        if (!validCoupon) {
            throw new Error("Invalud Coupon");
        }
        const user = await User.findById(_id);
        console.log(user._id);
        let { cartTotal } = await Cart.findOne({ orderBy: user._id }).populate("products.product");
        let totalAfterDiscount = (cartTotal - (cartTotal * validCoupon.discount / 100)).toFixed(2);
        const updateCart = await Cart.findOneAndUpdate({ orderBy: user._id }, {
            totalAfterDiscount
        }, {
            new: true,
        })
        res.json(updateCart);
    }),

    createOrder: asyncHandler(async (req, res) => {
        const { COD, couponApplied } = req.body;
        const { _id } = req.user;
        try {
            if (!COD) throw new Error("Create cash order failed");
            const user = await User.findById(_id);
            let userCart = await Cart.findOne({ orderBy: user._id });
            console.log(userCart.products);
            let finalAmount = 0;
            if (couponApplied && userCart.totalAfterDiscount)
                finalAmount = userCart.totalAfterDiscount;
            else {
                finalAmount = userCart.cartTotal;
            }
            let newOrder = await new Order({
                products: userCart.products,
                paymentIntent: {
                    id: uniqid(),
                    method: "COD",
                    amount: finalAmount,
                    status: "Cash on Delivery",
                    created: Date.now(),
                    currency: "usd"
                },
                orderBy: user._id,
                orderStatus: "Cash on Delivery"
            }).save();

            let update = userCart.products.map((item) => {
                return {
                    updateOne: {
                        filter: { _id: item.product._id },
                        update: { $inc: { quantity: -item.count, sold: +item.count } }
                    }
                }
            });

            const updated = await Product.bulkWrite(update, {});
            res.json({ message: "success" });

        } catch (error) {
            throw new Error(error);
        }
    }),

    getOrder: asyncHandler(async (req, res) => {
        const { _id } = req.user;
        validateMongoDbId(_id);
        try {
            const userOrder = await Order.findOne({ orderBy: _id }).populate("products.product").exec();
            res.json(userOrder);
        } catch (error) {
            throw new Error(error)
        }
    }),

    updateOrderStatus: asyncHandler(async (req, res) => {
        const { status } = req.body;
        const { id } = req.params;
        try {
            const updateOrder = await Order.findByIdAndUpdate(id, {
                orderStatus: status,
                paymentIntent: {
                    status: status
                }
            }, {
                new: true
            });
            res.json(updateOrder);
        } catch (error) {
            throw new Error(error)
        }
    })
}