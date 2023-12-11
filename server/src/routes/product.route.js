const express = require("express");
const router = express.Router();

const middleWare = require("../middlewares/authMiddleware");
const { product } = require("../controller/index.controller");

router.post("/create", middleWare.verifyToken, middleWare.isAdmin, product.createProduct);
router.get("/:id", product.getProduct);
router.put("/:id", middleWare.verifyToken, middleWare.isAdmin, product.updateProduct);
router.get("/", product.getAllProducts);
router.delete("/:id", middleWare.verifyToken, middleWare.isAdmin, product.deleteProduct);

module.exports = router;