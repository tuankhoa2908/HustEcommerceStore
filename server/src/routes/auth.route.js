const express = require("express");
const router = express.Router();

const { user } = require("../controller/index.controller");
const middleware = require("../middlewares/authMiddleware");

// POST route
router.post("/register", user.createUser);
router.post("/login", user.loginUser);
router.post("/admin-login", user.loginAdmin);
router.post("/update_password", middleware.verifyToken, user.changePassword);
router.post("/forgot-password-token", user.forgotPasswordToken);
router.post("/cart", middleware.verifyToken, user.userCart);
router.post("/cart/apply-coupon", middleware.verifyToken, user.applyCoupon);
router.post("/cart/cash-order", middleware.verifyToken, user.createOrder);
// GET route
router.get("/logout", user.logoutUser);
router.get("/alluser", user.getAllUser);
router.get("/refresh", user.handleRefreshToken);
router.get("/cart", middleware.verifyToken, user.getUserCart);
router.get("/wishlist", middleware.verifyToken, user.getWishList);
router.get("/get-order", middleware.verifyToken, user.getOrder);
router.get("/:id", middleware.verifyToken, middleware.isAdmin, user.getUser);
// DELETE route
router.delete("/empty-cart", middleware.verifyToken, user.emptyCart);
router.delete("/:id", user.deleteUser);
// PUT route
router.put("/reset-password/:token", user.resetPassword);
router.put("/update_user", middleware.verifyToken, user.updateUser);
router.put("/save-address", middleware.verifyToken, user.saveAddress);
router.put("/update-order/:id", middleware.verifyToken, middleware.isAdmin, user.updateOrderStatus);
router.put("/block_user/:id", middleware.verifyToken, middleware.isAdmin, user.blockUser);
router.put("/unblock_user/:id", middleware.verifyToken, middleware.isAdmin, user.unblockUser);


module.exports = router;
