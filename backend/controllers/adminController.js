const asyncHandler = require("express-async-handler");
const Product = require("../models/product.Model");
const {generateTokenAdmin} = require("../config/generateToken");
const Order = require("../models/orderModel");
const User = require("../models/userModel");
const {StatusOrder} = require("../util/constant");

const loginAsAdmin = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const user = await User.findOne({ name: username });
  if (!user) {
    res.status(400).json({
      message: 'Sai tài khoản hoặc mật khẩu'
    })
  }
  if (user.isAdmin === '0') {
    res.status(403).json({
      message: 'Xác thực thất bại'
    })
  }
  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      token: generateTokenAdmin(user._id),
      cartId: user.cartId
    });
  } else {
    res.status(401);
    throw new Error("Invalid Email or Password");
  }
});

const createProduct = asyncHandler(async (req, res) => {
  try {
    const { name, description, stock, author, type, price, salePercent, salePrice, weight, height, width, length } = JSON.parse(req.body.data);
    const product = await Product.create({
      name,
      description,
      stock,
      image: req.file.filename,
      author,
      type,
      price,
      salePercent,
      salePrice,
      weight,
      height,
      width,
      length
    });

    if (product) {
      res.status(201).json({
        _id: product._id,
        name: product.name,
        stock: product.stock,
        image: product.image,
        type: product.type,
        price: product.price,
        author: product.author,
        salePercent: product.salePercent
      });
    }
  } catch (e) {
    res.status(400).json({
      message: 'Thêm mới sản phẩm lỗi'
    });
  }
});

const getAllUser = asyncHandler(async (req, res) => {
  try {
    const  {searchTerm}= req.query
    const pageSize = Number(req.query?.pageSize || 10)
    const pageNumber = Number(req.query?.pageNumber || 1)
    const skip = (pageNumber - 1) * pageSize;

    const query = searchTerm ? { name: { $regex: new RegExp(searchTerm, 'i') } } : {}
    const [user, total] = await Promise.all([
      User.find(query).skip(Number(skip)).limit(Number(pageSize)).sort({ createdAt: -1 }).exec(),
      User.countDocuments(query).exec(),
    ]);
    const totalPages = Math.ceil(total / pageSize);

    const pagination = {
      count: user.length,
      currentPage: pageNumber,
      pageNumber: pageNumber,
      pageSize: pageSize,
      perPage: pageSize,
      total: total,
      totalPages: totalPages,
    };
    if (user) {
      res.json({
        user,
        pagination
      })
    }
  } catch (e) {
    res.status(400).json({
      message: 'Lấy thông tin user thất bại!'
    })
  }
});




const getAllProducts = asyncHandler(async (req, res) => {
  try {
    const {searchTerm}= req.query
    const pageSize = Number(req.query?.pageSize || 10)
    const pageNumber = Number(req.query?.pageNumber || 1)
    const query = searchTerm ? { name: { $regex: new RegExp(searchTerm, 'i') } } : {}
    const skip = (pageNumber - 1) * pageSize;
    const [product, total] = await Promise.all([
      Product.find(query).skip(Number(skip)).limit(Number(pageSize)).sort({ createdAt: -1 }).exec(),
      Product.countDocuments(query).exec(),
    ]);
    const totalPages = Math.ceil(total / pageSize);

    const pagination = {
      count: product.length,
      currentPage: pageNumber,
      pageNumber: pageNumber,
      pageSize: pageSize,
      perPage: pageSize,
      total: total,
      totalPages: totalPages,
    };
    if (product) {
      return res.json({
        products: product,
        pagination
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: 'Lấy thông tin sản phẩm thất bại!'
    })
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    const {searchTerm}= req.query
    const pageSize = Number(req.query?.pageSize || 10)
    const pageNumber = Number(req.query?.pageNumber || 1)
    const query = searchTerm ? { _id: searchTerm} : {}
    const skip = (pageNumber - 1) * pageSize;
    const [orders, total] = await Promise.all([
      Order.find({...query,  type: 'active'}).skip(Number(skip)).limit(Number(pageSize))
        .populate({
          path: 'products.product',
        })
        .populate({
          path: 'user'
        })
        .sort({ createdAt: -1 }).exec(),
      Order.countDocuments(query).exec(),
    ]);
    const totalPages = Math.ceil(total / pageSize);

    const pagination = {
      count: orders.length,
      currentPage: pageNumber,
      pageNumber: pageNumber,
      pageSize: pageSize,
      perPage: pageSize,
      total: total,
      totalPages: totalPages,
    };
    if (orders) {
      return res.json({
        orders,
        pagination
      })
    }
  } catch (e) {
    return res.status(400).json({
      message: 'Lấy thông tin sản phẩm thất bại!'
    })
  }
});

const editProduct = asyncHandler(async (req, res) => {
  try {
    const {productId} = req.query
    const { name, description, stock, author, type, price, salePercent, salePrice } = JSON.parse(req.body.data);
    const imagePath = req.file ? req.file.path : null
    const product = await Product.findByIdAndUpdate(productId, {
      name,
      description,
      stock,
      ...(imagePath && {image: imagePath}),
      author,
      type,
      price,
      salePercent,
      salePrice
    }, {new: true}).exec()

    if (product) {
      res.status(201).json({
        _id: product._id,
        name: product.name,
        stock: product.stock,
        image: product.image,
        type: product.type,
        price: product.price,
        author: product.author,
        salePercent: product.salePercent
      });
    }
  } catch (e) {
    res.status(400).json({
      message: 'Sửa sản phẩm lỗi'
    });
  }
});


const editOrderStatus = asyncHandler(async (req, res) => {
  try {
    const {orderId} = req.query
    const { status } = req.body
    if (status === StatusOrder.CANTCONTACT) {

    }
    const order = await Order.findByIdAndUpdate(orderId, {
      status: status
    }, {new: true}).exec()
    await Promise.all(
      order.products.map(async item => {
        const { product, quantity } = item;
        try {
          // Thực hiện cập nhật cho từng sản phẩm
          const result = await Product.updateOne({ _id: product }, { $inc: { stock: quantity } });
        } catch (err) {
          console.error(`Lỗi cập nhật sản phẩm với id ${product}:`, err);
        }
      })
    )
    res.json({
      message:'Cập nhật thành công'
    })
  } catch (e) {
    res.status(400).json({
      message: 'Sửa sản phẩm lỗi'
    });
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  try {

    const {userId}= req.query
    const user = await User.deleteOne({_id: userId}).exec();
    if (user) {
      res.json({
        message: "Xoá thành công"
      })}
  } catch (e) {
    res.status(400).json({
      message: 'Xóa người dùng thất bại'
    })
  }
});

const deleteProduct = asyncHandler(async (req, res) => {
  try {

    const {productId}= req.query
    const user = await Product.deleteOne({_id: productId}).exec();
    if (user) {
      res.json({
        message: "Xoá thành công"
      })}
  } catch (e) {
    res.status(400).json({
      message: 'Xóa sản phẩm thất bại'
    })
  }
});

module.exports = { loginAsAdmin, getAllUser, deleteUser, getAllProducts, editProduct, deleteProduct, getAllOrders, createProduct, editOrderStatus };
