const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {checkoutCart, getOrders, getOrderDetail, createCheckoutSession, webhookStripe, changeStatusOrder} = require("../controllers/orderController");
const router = express.Router();

router.post('/checkout', protect , checkoutCart);
router.put("/change-status", protect , changeStatusOrder);
// router.get("/", protect , viewOrder);
router.get('/', protect, getOrders)
router.get('/detail', protect, getOrderDetail)
router.post('/create-checkout-session', protect , createCheckoutSession);
router.post('/webhook-stripe' , webhookStripe);

module.exports = router;
