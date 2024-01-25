const express = require("express");
const {
  registerUser,
  authUser,
  getCartId,
} = require("../controllers/userControllers");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post('/',registerUser);
router.post("/login", authUser);
router.get("/get-cart-id",protect, getCartId);

module.exports = router;
