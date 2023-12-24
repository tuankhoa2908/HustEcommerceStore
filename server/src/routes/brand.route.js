const express = require("express");
const router = express.Router();

const middleware = require("../middlewares/authMiddleware");
const { brand } = require("../controller/index.controller");

router.post("/", middleware.verifyToken, middleware.isAdmin, brand.createBrand);
router.put("/:id", middleware.verifyToken, middleware.isAdmin, brand.updateBrand);
router.delete("/:id", middleware.verifyToken, middleware.isAdmin, brand.deleteBrand);
router.get("/:id", brand.getBrand);
router.get("/", brand.getAllBrand);



module.exports = router;