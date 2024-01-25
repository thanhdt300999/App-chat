const mongoose = require("mongoose");

const orderModel = new mongoose.Schema(
    {
      status: {type: String},
      checkoutSession: {
        type: String
      },
      type:{
        type: String,
        required: true
      },
      orderId: {
        type: Number,
        default: 1
      },
      products: [{
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product'
        },
        quantity: {
          type: Number
        }
      }],
      typeShip: {
        type: String
      },
      paymentStatus: {
        type: Number
      },
      summary: {
        total: {
          type: Number
        },
        shippingFee: {
          type: Number
        }
      },
      createdAt: {
        type: Date,
        default: Date.now()
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      },
      phone: {
        type: String,
        required: true
      },
      firstName: {
        type: String,
        required: true
      },
      lastName: {
        type: String,
        required: true
      },
      note: {
        type: String,
      },
      address: {
        province: {
          type: String,
          required: true
        },
        district: {
          type: String,
          required: true
        },
        ward: {
          type: String,
          required: true
        }
      },

    },
    { timestamps: true }
);


const Order = mongoose.model("Order", orderModel);

module.exports = Order;
