const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/product.Model");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const stripe = require('stripe')('sk_test_51OXwdgJSja20Gc8ivnmPvuxWQgCETOrwciq0BKVvEEWQ4sbBqiYYMB5MlpGPyAALJZlaqAVUzqoCDA2NH9I1z9hQ00l5sOUM2t')

const axios = require("axios");
const mongoose = require("mongoose");
const {StatusOrder, OrderNumberStatus} = require("../util/constant");

const createCheckoutSession = asyncHandler(async(req, res) => {
  try {
    const {products, cartId, firstName, lastName, note, district, province, ward, shippingFee, phone} = req.body
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

    const productOrder = cart.products.map(prod1 => prod1.toObject()).map(item => {
      return {
        product: item.productId._id,
        quantity: item.quantity
      }
    })

    const lineItems = products?.map(product => {
      return {
        price_data: {
          currency: 'vnd',
          product_data: {
            name: product.name,
            images: [product.image]
          },
          unit_amount: product.salePrice
        },
        quantity: product.quantity
      }
    })

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          fixed_amount: {
            amount: shippingFee,
            currency: 'vnd',
          },
          display_name: 'Phí ship',
        },
      }],
      line_items: lineItems,
      mode:'payment',
      success_url: 'http://localhost:3000/home/pages/order-success',
      cancel_url: 'http://localhost:3000/home/404'
    })

    const order = await Order.create({
      cartId: cartId,
      user: userId,
      note: note,
      firstName,
      checkoutSession: session.id,
      type: 'in-active',
      lastName,
      paymentStatus: 0,
      phone,
      typeShip: 'online',
      products: productOrder,
      status: StatusOrder.WAITING_SHIPPING,
      address: {
        province,
        district,
        ward
      },
      summary: {
        total: cart.summary.total,
        shippingFee
      }
    })

    res.json({
      id:session.id
    })
  } catch (e) {
    res.status(400).json({
      message: "Checkout lỗi"
    })
  }
})

const webhookStripe = asyncHandler(async(req, res) => {
  if (req.body.type === 'checkout.session.async_payment_failed') {
    const order = await Order.delete({checkoutSession: req.body.data.object.id})
    res.end()
  }

  if (req.body.type === 'checkout.session.completed') {
    const order = await Order.findOneAndUpdate({checkoutSession: req.body.data.object.id}, {
      type: 'active',
      paymentStatus: 1.
    }, {new: true}).exec()
    const userIdOrder = order.user
    //Update cart id of user
    const user = await User.findByIdAndUpdate(userIdOrder, {
      cartId: null
    })

  }
})

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

    for (const updateItem of productOrder) {
      const { product, quantity } = updateItem;

      // Tìm kiếm và cập nhật từng bản ghi dựa trên productId
      const result = await Product.findOneAndUpdate(
        { _id: product },
        {
          $inc: {
            stock: -quantity, // Giảm stock đi quantity
            bought: quantity, // Tăng bought đi quantity
          },
        },
        { returnDocument: 'after' } // Trả về bản ghi sau khi cập nhật
      );

      console.log(`Updated product with productId ${productId}:`, result.value);
    }

    const order = await Order.create({
      cartId: cartId,
      user: userId,
      note: note,
      firstName,
      type: 'active',
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
        total: cart.summary.total,
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
    res.status(400).json({
      message: 'Thanh toán thất bại!'
    })
  }
});


const getOrders = asyncHandler(async (req, res) => {
  try {
    const pageSize = Number(req.query?.pageSize || 10)
    const pageNumber = Number(req.query?.pageNumber || 1)
    const userId = res.locals.decodeToken?.id

    const skip = (pageNumber - 1) * pageSize;
    const [data, total] = await Promise.all([
      Order.find({ user: userId, type: 'active'}).sort({createdAt: -1}).skip(Number(skip)).limit(Number(pageSize)).populate({
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
    if (order.user != userId) {
      return res.status(400).json({
        message: "Lấy thông tin chi tiết đơn hàng thất bại"
      })
    }

    res.json({
      order: order,
    })

  } catch (e) {
    return res.status(400).json({
      message: "Lấy thông tin chi tiết đơn hàng thất bại"
    })
  }
});

const validateOrder = (statusReq, statusOrder) => {
  if (statusReq === OrderNumberStatus.CANCELLED) {
    return statusOrder === OrderNumberStatus.WAITING_SHIP
  }
  if (statusReq === OrderNumberStatus.RECEIVED) {
    return statusOrder === OrderNumberStatus.SHIPPING
  }
  return false
}

const changeStatusOrder = asyncHandler(async (req, res) => {
  try {
    const {status} = req.body
    const {orderId} = req.query
    const order = await Order.findById(orderId).exec()
    if (validateOrder(status, order.status)) {
      const order1 = await Order.findByIdAndUpdate(orderId, {
        status: status
      })
      if (status === OrderNumberStatus.CANCELLED) {
        const productList = order.products
        for (const productToUpdate of productList) {
          try {
            const updatedProduct = await Product.findOneAndUpdate(
              { _id: productToUpdate.product },
              { $inc: { stock: productToUpdate.quantity } }, // Tăng giá trị của stock
              { new: true }
            );
          } catch (error) {
            return res.status(400).json({
              message: "Thay đổi trạng thái đơn hàng thất bại"
            })
          }
        }
      }
      res.json({
        order: order1,
      })
    } else {
      return res.status(400).json({
        message: "Thay đổi trạng thái đơn hàng thất bại"
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: "Thay đổi trạng thái đơn hàng thất bại"
    })
  }
});


module.exports = { getOrders, checkoutCart, getOrderDetail, createCheckoutSession, webhookStripe, changeStatusOrder };
