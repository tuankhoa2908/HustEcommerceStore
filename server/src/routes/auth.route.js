const express = require("express");
const router = express.Router();

const { user } = require("../controller/index.controller");
const middleware = require("../middlewares/authMiddleware"); 

router.post("/register", user.createUser);
router.post("/login", user.loginUser);
router.get("/alluser", user.getAllUser);
router.get("/:id", middleware.authMiddleware ,middleware.isAdmin, user.getUser);
router.delete("/:id", user.deleteUser);
router.put("/:id", user.updateUser);

module.exports = router;
