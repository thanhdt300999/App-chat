const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {addItemsToCart, getCountCart, getCart, updateCart, getProvince, getDistrict, getWard, getShippingFee} = require("../controllers/cartController");

const router = express.Router();

router.post('/add-items', protect , addItemsToCart);
router.get("/count-cart", protect , getCountCart);
router.get("/", protect , getCart);
router.put("/update", protect , updateCart);
router.get("/province", protect , getProvince);
router.get("/district", protect , getDistrict);
router.get("/ward", protect , getWard);
router.get("/caculateShippingFree", protect , getShippingFee);

module.exports = router;
