const mongoose = require("mongoose");

const cartModel = new mongoose.Schema(
    {
      status: {type: String},
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
      address: {
        province: {
          ProvinceID: {
            type: Number
          },
          ProvinceName: {
            type: String
          },
          Code: {
            type: Number
          },
        },
        district: {
          DistrictID: {
            type: Number
          },
          ProvinceID: {
            type: Number
          },
          DistrictName: {
            type: String
          },
          SupportType: {
            type: Number,
            enum: [1,2,3,0]
          },
        },
        ward: {
          WardCode: {
            type: Number
          },
          DistrictID: {
            type: Number
          },
          WardName: {
            type: String
          }
        }
      },

    },
    { timestamps: true }
);

const Cart = mongoose.model("Cart", cartModel);

module.exports = Cart;
