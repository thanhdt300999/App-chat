const asyncHandler = require("express-async-handler");
const Product = require("../models/product.Model");

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
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.query;
  try {
    const products = await Product.findById(id)
    res.json({products})
  } catch (e) {
    res.json({
      message: e
    })
  }
});

module.exports = { getAllProduct };
