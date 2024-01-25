const mongoose = require("mongoose");

const productModel = new mongoose.Schema(
  {
    name: { type: String, required: true},
    stock: {type: Number,  required: true},
    description: { type: String },
    image: { type: String },
    salePercent: {
      type: Number
    },
    author: {
      type: String,
    },
    type: {
      type: String,
    },
    price: {
      type: Number,
      required: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    weight: {
      type: Number,
    },
    length: {
      type: Number,
    },
    width: {
      type: Number,
    },
    height: {
      type: Number,
    },
    salePrice: {
      type: Number
    },
    bought: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productModel);

module.exports = Product;
