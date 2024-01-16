const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/product.Model");
const User = require("../models/userModel");
const Order = require("../models/orderModel");

const axios = require("axios");
const mongoose = require("mongoose");
const {StatusOrder} = require("../util/constant");



const checkoutCart = asyncHandler(async (req, res) => {
  try {
    const {cartId, firstName, lastName, note, district, province, ward, shippingFee, phone} = req.body
    if (!cartId || !firstName || !lastName || !district || !province || !ward || !phone) {
      return res.status(400).json({
        message: "Lỗi khi thanh toán"
      })
    }
    const userId = res.locals.decodeToken?.id
    const cart = await Cart.findById(cartId).populate({
      path: 'products.productId'
    })
    const productId = cart.products.map(item => mongoose.Types.ObjectId(item.productId._id))
    const listProduct = await Product.find({"_id": {$in: productId}})
    const productQuantity = [...cart.products].map(prod1=> prod1.toObject()).map(prod => {
      return {
        _id: prod.productId._id,
        quantity: prod.quantity,
        message: "Sản phẩm đã hết hàng",
        ...prod.productId
      }
    })
    const invalidItems = [];
    for (const itemB of productQuantity) {
      const correspondingItemA = listProduct.find(itemA => itemA._id.toString() === itemB._id.toString());
      if (correspondingItemA && itemB.quantity > correspondingItemA.stock) {
        invalidItems.push(itemB);
      }
    }
    if (invalidItems.length) {
      return res.status(400).json({
        invalidItems,
        message: "Thanh toán thất bại!"
      })
    }

    //Case success
    const productOrder = cart.products.map(prod1 => prod1.toObject()).map(item => {
      return {
        product: item.productId._id,
        quantity: item.quantity
      }
    })
    const order = await Order.create({
      cartId: cartId,
      user: userId,
      note: note,
      firstName,
      lastName,
      paymentStatus: 0,
      phone,
      typeShip: 'offline',
      products: productOrder,
      status: StatusOrder.WAITING_SHIPPING,
      address: {
        province,
        district,
        ward
      },
      summary: {
        total: cart.summary.toal,
        shippingFee
      }
    })
    const user = await User.findByIdAndUpdate(userId, {
      cartId: null
    })
    res.json({
      order
    })
  } catch (e) {
    console.log(e)
  }
});


const getOrders = asyncHandler(async (req, res) => {
  try {
    const pageSize = Number(req.query?.pageSize || 10)
    const pageNumber = Number(req.query?.pageNumber || 1)
    const userId = res.locals.decodeToken?.id

    const skip = (pageNumber - 1) * pageSize;

    const [data, total] = await Promise.all([
      Order.find({ user: userId }).skip(Number(skip)).limit(Number(pageSize)).populate({
        path: 'products.product'
      }).exec(),
      Order.countDocuments({ user: userId }).exec(),
    ]);
    const totalPages = Math.ceil(total / pageSize);

    const pagination = {
      count: data.length,
      currentPage: pageNumber,
      pageNumber: pageNumber,
      pageSize: pageSize,
      perPage: pageSize,
      total: total,
      totalPages: totalPages,
    };
    res.json({
      orders: data,
      pagination,
    })
  } catch (e) {
    return res.status(400).json({
      message: "Lấy thông tin đơn hàng thất bại"
    })
  }
});


const getOrderDetail = asyncHandler(async (req, res) => {
  try {
    const {orderId} = req.query
    const userId = res.locals.decodeToken?.id

    if (!orderId) {
      return res.status(400).json({
        message: "Lấy thông tin chi tiết đơn hàng thất bại"
      })
    }

    const order = await Order.findById(orderId).populate({
      path: 'products.product'
    }).exec()
    console.log(order)
    if (order.user != userId) {
      return res.status(400).json({
        message: "Lấy thông tin chi tiết đơn hàng thất bại"
      })
    }

    res.json({
      order: order,
    })

  } catch (e) {
    console.log(e)
    return res.status(400).json({
      message: "Lấy thông tin chi tiết đơn hàng thất bại"
    })
  }
});

module.exports = { getOrders, checkoutCart, getOrderDetail };
