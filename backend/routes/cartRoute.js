const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {addItemsToCart, getCountCart, getCart} = require("../controllers/cartController");

const router = express.Router();

router.post('/add-items', protect , addItemsToCart);
router.get("/count-cart", protect , getCountCart);
router.get("/", protect , getCart);

module.exports = router;
