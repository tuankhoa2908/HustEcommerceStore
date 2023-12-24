const express = require("express");
const router = express.Router();

const { coupon } = require("../controller/index.controller");
const middleWare = require("../middlewares/authMiddleware");

router.post("/", middleWare.verifyToken, middleWare.isAdmin, coupon.createCoupon);
router.get("/", middleWare.verifyToken, coupon.getAllCoupon);
router.get("/:id", middleWare.verifyToken, coupon.getCoupon);
router.put("/:id", middleWare.verifyToken, coupon.updateCoupon);
router.delete("/:id", middleWare.verifyToken, middleWare.isAdmin, coupon.deleteCoupon);

module.exports = router;