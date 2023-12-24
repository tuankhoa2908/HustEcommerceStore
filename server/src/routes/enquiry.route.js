const express = require("express");
const router = express.Router();

const middleware = require("../middlewares/authMiddleware");
const { enquiry } = require("../controller/index.controller");

router.post("/", enquiry.createEnquiry);
router.put("/:id", middleware.verifyToken, middleware.isAdmin, enquiry.updateEnquiry);
router.delete("/:id", middleware.verifyToken, middleware.isAdmin, enquiry.deleteEnquiry);
router.get("/:id", enquiry.getEnquiry);
router.get("/", enquiry.getAllEnquiry);

module.exports = router;