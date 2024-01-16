const asyncHandler = require("express-async-handler");
const Cart = require("../models/cartModel");
const Product = require("../models/product.Model");
const User = require("../models/userModel");
const axios = require("axios");
const mongoose = require("mongoose");

const ghnRequester = axios.create({
  headers: {
    Token: '0e9fc71e-9af9-11ee-8bfa-8a2dda8ec551',
    "Content-Type": 'application/json',
    ShopId: process.env.SHOP_ID_GHN
  },
  baseURL: 'https://dev-online-gateway.ghn.vn'
})

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
        productId: products[0]._id,
        summary: {
          total: products[0].quantity * products[0].price
        }
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
      const summary = cart?.summary + products[0].quantity * products[0].price
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
                "products": newListProduct,
                'summary':  {
                  total: summary
                }
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
      if (cart1) {
        res.status(201).json({data: cart1});
      }
    }
  } catch (e) {
    res.status(400).json({
      message: 'Thêm sản phẩm vào giỏ hàng thất bại'
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
      message: 'Lấy thông tin số lượng sản phẩm trong giỏ hàng thất bại'
    })
  }
});


const getCart = asyncHandler(async (req, res) => {
  const { cartId } = req.query;

  try {
    if(!cartId) {
      return res.json({})
    }
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
      message: 'Lấy thông tin giỏ hàng thất bại'
    })
  }
});

const updateCart = asyncHandler(async (req, res) => {
  const { products, cartId, summary } = req.body
  const productId = products.map(item => mongoose.Types.ObjectId(item.productId._id))
  const listProduct = await Product.find({"_id": {$in: productId}})
  const productQuantity = products?.map(item => {
    return {
      ...item,
      _id: item.productId._id,
      quantity: item.quantity,
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
      message: "Cập nhật giỏ hàng thất bại!"
    })
  }
  const countCart = products?.reduce((acc, current) => {
    return acc + current?.quantity
  }, 0)
  try {
    const cart = await Cart.findByIdAndUpdate(cartId, {
      count: countCart,
      products: products,
      summary: summary
    }, {new: true}).populate({
      path: 'products.productId'
    })
    if (cart) {
      res.json({
        cart
      })
    }
  } catch (e) {
    console.log(e)
    res.status(400).json({
      message: e
    })
  }
});


const getProvince = asyncHandler(async (req, res) => {
  try {
    const province = await ghnRequester.get('/shiip/public-api/master-data/province').then(rs => {
      return rs.data
    })
    if (province) {
      res.json({
        ...province
      })
    }
  } catch (e) {
    res.json({
      message: 'Lấy thông tin Tỉnh/Thành phố thất bại'
    })
  }
});

const getDistrict = asyncHandler(async (req, res) => {
  const {province_id} = req.query

  try {
    const district = await ghnRequester.get(`/shiip/public-api/master-data/district?province_id=${province_id}`).then(rs => {
      return rs.data
    })
    if (district) {
      res.json({
        ...district
      })
    }
  } catch (e) {
    res.json({
      message: 'Lấy thông tin Quận/Huyện thất bại'
    })
  }
});


const getWard = asyncHandler(async (req, res) => {
  const {district_id} = req.query
  try {
    const ward = await ghnRequester.get('/shiip/public-api/master-data/ward', {
      params: {
        district_id: Number(district_id)
      }
    }).then(rs => {
      return rs.data
    })
    if (ward) {
      res.json({
        ...ward
      })
    }
  } catch (e) {
    res.json({
      message: "Lấy thông tin Phường/Xã thất bại"
    })
  }
});

const getShippingFee = asyncHandler(async (req, res) => {
  const {district_id, ward_code, height, width, length, weight, insurance_value, cod_value} = req.query

  try {
    const shippingFee = await ghnRequester.post('/shiip/public-api/v2/shipping-order/fee', {
      from_district_id: Number(process.env.DISTRICT_DEFAULT),
      from_ward_code: process.env.WARD_CODE,
      service_id: Number(process.env.SERVICE_ID),
      to_district_id: Number(district_id),
      to_ward_code: ward_code,
      service_type_id: null,
      height: Number(height),
      weight: Number(weight),
      length: Number(length),
      width: Number(width),
      insurance_value: 0,
      cod_failed_amount: 0,
      cod_value: 0,
      coupon: null
    }).then(rs => {
      return rs.data
    })
    if (shippingFee) {
      res.json({
        ...shippingFee
      })
    }
  } catch (e) {
    console.log(e)
    res.json({
      message: "Lấy thông tin Phường/Xã thất bại"
    })
  }
});

module.exports = { addItemsToCart, getCountCart, getCart, updateCart, getProvince, getDistrict, getWard, getShippingFee };
