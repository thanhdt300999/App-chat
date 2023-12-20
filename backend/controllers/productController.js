const asyncHandler = require("express-async-handler");
const Product = require("../models/product.Model");

// const allUsers = asyncHandler(async (req, res) => {
//   const keyword = req.query.search
//     ? {
//       $or: [
//         { name: { $regex: req.query.search, $options: "i" } },
//         { email: { $regex: req.query.search, $options: "i" } },
//       ],
//     }
//     : {};
//
//   const users = await User.find(keyword).find({ _id: { $ne: req.user._id } });
//   res.send(users);
// });

//@description     Register new user
//@route           POST /api/user/
//@access          Public
const createProduct = asyncHandler(async (req, res) => {
  const { name, description, stock, image, author, type, price, salePercent } = req.body;
  console.log(req.body);
  if (!name || !description || !stock || !author || !type || !price) {
    res.status(400);
    throw new Error("Please Enter all the fields");
  }

  const product = await Product.create({
    name,
    description,
    stock,
    image,
    author,
    type,
    price,
    salePercent
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
  } else {
    res.status(400);
    throw new Error("Have issue");
  }
});

//@description     Auth the user
//@route           POST /api/users/login
//@access          Public
const getAllProduct = asyncHandler(async (req, res) => {
  const { keyword, type, author, minPrice, maxPrice } = req.query;
      const keywordQuery = new RegExp(keyword, 'i')
  let query = {
    ...(keyword && {name: keywordQuery}),
    ...(type && {type: type}),
    ...(author && {type: author}),
    ...(minPrice && maxPrice && {price: {$gt: maxPrice, $lt: minPrice}}),
  }

  try {
    const products = await Product.find({...query})
    res.json({products})
  } catch (e) {
    res.json({
      message: e
    })
  }
  // if (user && (await user.matchPassword(password))) {
  //   res.json({
  //     _id: user._id,
  //     name: user.name,
  //     email: user.email,
  //     isAdmin: user.isAdmin,
  //     pic: user.pic,
  //     token: generateToken(user._id),
  //   });
  // } else {
  //   res.status(401);
  //   throw new Error("Invalid Email or Password");
  // }
});

module.exports = { createProduct, getAllProduct };
