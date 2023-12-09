const express = require("express");
const router = express.Router();

const { user } = require("../controller/index.controller");
const middleware = require("../middlewares/authMiddleware");

router.post("/register", user.createUser);
router.post("/login", user.loginUser);
router.get("/logout", user.logoutUser);
router.get("/alluser", user.getAllUser);
router.get("/refresh", user.handleRefreshToken);
router.get("/:id", middleware.verifyToken, middleware.isAdmin, user.getUser);
router.delete("/:id", user.deleteUser);
router.put("/update_user", middleware.verifyToken, user.updateUser);
router.put("/block_user/:id", middleware.verifyToken, middleware.isAdmin, user.blockUser);
router.put("/unblock_user/:id", middleware.verifyToken, middleware.isAdmin, user.unblockUser);



module.exports = router;
