const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");

module.exports = {
    authMiddleware: asyncHandler(async (req, res, next) => {
        let token;
        if (req?.headers?.authorization?.startsWith('Bearer')) {
            token = req.headers.authorization.split(" ")[1];
            try {
                if (token) {
                    const decoded = jwt.verify(token, process.env.JWT_SECRET);
                    const user = await User.findById(decoded?.id);
                    req.user = user;
                    next();
                }
            } catch (error) {
                throw new Error("Not Authorization token expired, Please login again");
            }
        } else {
            throw new Error("There is no token attached to header");
        }
    }),

    isAdmin: asyncHandler(async(req,res,next)=>{
        console.log(req.user);
    })
}
