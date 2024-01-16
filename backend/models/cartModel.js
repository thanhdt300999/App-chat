const mongoose = require("mongoose");

const cartModel = new mongoose.Schema(
  {
    products: [{
      productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
      },
      quantity: {type: Number,  required: true}
    }],
    summary: {
      total: {
        type: Number
      },
    },
    count: {
      type: Number
    }
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartModel);

module.exports = Cart;
