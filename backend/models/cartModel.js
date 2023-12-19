const mongoose = require("mongoose");

const cartModel = mongoose.Schema(
  {
    products: [{
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
      },
      quantity: {type: Number,  required: true}
    }],
    stock: {type: Number,  required: true},
    description: { type: String },
    image: { type: String },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Author',
    },
    type: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TypeBook'
    },
    price: {
      type: Number,
      required: true
    }
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", cartModel);

module.exports = Cart;
