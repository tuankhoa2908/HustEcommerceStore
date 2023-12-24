const express = require("express");
const router = express.Router();

const middleWare = require("../middlewares/authMiddleware");
const { product } = require("../controller/index.controller");
const uploadImages = require("../middlewares/uploadImages");

router.post("/create", middleWare.verifyToken, middleWare.isAdmin, product.createProduct);
router.get("/:id", product.getProduct);
router.put("/upimg/", middleWare.verifyToken, middleWare.isAdmin, uploadImages.uploadPhoto.array('images', 10), uploadImages.productImgResize, product.uploadImages);
router.put("/rating", middleWare.verifyToken, product.rating);
router.put("/:id", middleWare.verifyToken, middleWare.isAdmin, product.updateProduct);
router.get("/", product.getAllProducts);
router.delete("/delete-img/:id", middleWare.verifyToken, middleWare.isAdmin, product.deleteImages);
router.delete("/:id", middleWare.verifyToken, middleWare.isAdmin, product.deleteProduct);
router.post("/wish", middleWare.verifyToken, product.addToWishList);


module.exports = router;