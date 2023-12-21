const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {addItemsToCart, getCountCart, getCart, updateCart} = require("../controllers/cartController");

const router = express.Router();

router.post('/checkout', protect , checkoutCart);
router.put("/change-status", protect , changeStatusOrder);
router.get("/", protect , viewOrder);

module.exports = router;
