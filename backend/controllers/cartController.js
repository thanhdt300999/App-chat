const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");


const addItemsToCart = asyncHandler(async (req, res) => {
  const { cartId, products } = req.body;
  const userId = res.locals.decodeToken?.id
  const countCart = products?.reduce((acc, current) => {
    return acc + current?.quantity
  }, 0)
  const listProductsId = products?.map(item => {
    return {
      productId: item._id,
      quantity: item.quantity
    }
  })
  let cart1;
  try {
    if (!cartId) {
      const cart = (await Cart.create({
        products: listProductsId,
        count: countCart,
        productId: products[0]._id
      }))
      const cart1 = await Cart.findById(cart._id).populate({
        path: 'products.productId'
      })
      if (cart1) {
        const user = await User.findByIdAndUpdate(userId, {cartId: cart1?._id})
        res.status(201).json({data: cart1});
      }
    } else {
      const newProduct = {
        productId: products[0]._id,
        quantity: products[0].quantity
      }
      const cart = await Cart.findById(cartId, null , {new: true})
      let cart1
      const newCountCart = cart?.count + countCart
      const existProduct = cart.products.find(item => item.productId == products[0]._id)
      const fakeList = [...cart.products]
      const newListProduct = fakeList.map(item => {
        if (item.productId == products[0]._id) {
          item.quantity = item.quantity + products[0].quantity
          return item
        }
        return item
      })

      if (existProduct) {
        cart1 = await Cart.findByIdAndUpdate(cartId,
            {
              $set: {
                'count': newCountCart,
                "products": newListProduct
              },
            },
            {arrayFilters: [{"t.productId": products[0]._id}], new: true},
        ).populate({
          path: 'products.productId'
        })
      } else {
         cart1 = await Cart.findByIdAndUpdate(cartId,
            {
              $push: {'products': newProduct},
              $set: {'count': newCountCart}
            },
            {new: true}
        ).populate({
          path: 'products.productId'
        })
      }
      console.log(cart1)
      if (cart1) {
        res.status(201).json({data: cart1});
      }
    }
  } catch (e) {
    console.log(e)
    res.status(400);
    res.json({
      message: e
    })
  }
});


const getCountCart = asyncHandler(async (req, res) => {
  const { cartId } = req.query;

  try {
    const cart = await Cart.findById(cartId)
    if (cart) {
      res.json({
        count: cart?.count
      })
    }
  } catch (e) {
    res.json({
      message: e
    })
  }
});


const getCart = asyncHandler(async (req, res) => {
  const { cartId } = req.query;

  try {
    const cart = await Cart.findById(cartId).populate({
      path: 'products.productId'
    })
    if (cart) {
      res.json({
        cart
      })
    }
  } catch (e) {
    res.json({
      message: e
    })
  }
});

module.exports = { addItemsToCart, getCountCart, getCart };
