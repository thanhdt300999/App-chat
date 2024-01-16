const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {checkoutCart, getOrders, getOrderDetail} = require("../controllers/orderController");

const router = express.Router();

router.post('/checkout', protect , checkoutCart);
// router.put("/change-status", protect , changeStatusOrder);
// router.get("/", protect , viewOrder);
router.get('/', protect, getOrders)
router.get('/detail', protect, getOrderDetail)

module.exports = router;
