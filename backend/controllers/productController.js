const asyncHandler = require("express-async-handler");
const Product = require("../models/product.Model");
const Order = require("../models/orderModel");

const getAllProduct = asyncHandler(async (req, res) => {
  const {
    keyword,
    type,
    author,
    min_price,
    max_price,
    pageSize,
    pageNumber,
    purchasable,
    sortBy
  } = req.query;

  let listAuthors
  if (author) {
    listAuthors = author.split(",")
  }
  const keywordQuery = new RegExp(keyword, 'i')
  const skip = (pageNumber - 1) * pageSize;
  const queryStock = () => {
    if (!purchasable) {
      return {}
    }
    return purchasable === 'false' ? { stock: { $lt: 1 } } : { stock: { $gt: 0 } }
  }
  let query = {
    ...(keyword && {name: keywordQuery}),
    ...(type && {type: type}),
    ...(author && {author: {$in: listAuthors}}),
    ...(max_price && min_price && {price: {$lt: Number(max_price), $gt: Number(min_price)}}),
    ...queryStock(),
  }
  try {

    const [products, total] = await Promise.all([
      Product.find({ ...query }).skip(Number(skip)).limit(Number(pageSize)).exec(),
      Product.countDocuments({ ...query }).exec(),
    ]);
    const totalPages = Math.ceil(total / pageSize);

    const pagination = {
      count: products.length,
      currentPage: Number(pageNumber),
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
      perPage: Number(pageSize),
      total: total,
      totalPages: totalPages,
    };

    res.json({
      products,
      pagination
    })
  } catch (e) {
    res.json({
      message: e
    })
  }
});

const getProductById = asyncHandler(async (req, res) => {
  const { id } = req.params;
  try {
    const products = await Product.findById(id)
    res.json({products})
  } catch (e) {
    res.json({
      message: e
    })
  }
});

const getAllAuthors = asyncHandler(async (req, res) => {
  try {
    const authors = await Product.distinct('author');
    res.json({authors})
  } catch (e) {
    res.json({
      message: e
    })
  }
});

const getByTypes = asyncHandler(async (req, res) => {
  console.log('caal here')
  try {
    const {types} = req.query
    const listTypes = types.split(",")


    const result = await Product.aggregate([
      { $match: { type: { $in: listTypes } } }, // Lọc các bản ghi theo giá trị type
      { $group: { _id: '$type', count: { $sum: 1 } } }, // Nhóm theo type và đếm số lượng
      { $project: { _id: 0, type: '$_id', count: 1 } }, // Định dạng lại kết quả
    ]).exec();
    console.log(result)
    res.json({result})
    
  } catch (e) {
    console.log(e)
    res.json({
      message: 'Lấy thông tin sản phẩm thất bại'
    })
  }
});

const getNewestProduct = asyncHandler(async (req, res) => {
  try {
    const newestProduct = await Product
      .find()
      .sort({ createdAt: -1 }) // Sắp xếp theo createdAt giảm dần
      .limit(20) // Giới hạn kết quả trả về chỉ 1 bản ghi
      .exec();
    res.json({newestProduct})
  } catch (e) {
    res.json({
      message: 'Lấy thông tin sản phẩm thất bại'
    })
  }
});

const getBestSaleProducts = asyncHandler(async (req, res) => {
  try {
    const {listType} = req.query
    const listType1 = listType.split(",")
    const allProduct = await Product
      .find()
      .sort({ bought: -1 }) // Sắp xếp theo trường bought giảm dần
      .limit(10) // Giới hạn kết quả trả về chỉ 10 bản ghi
      .exec();

    const object ={}
    
    for (const item of listType1) {
      object[item] = await Product
        .find({type: `${item}`})
        .sort({ bought: -1 }) // Sắp xếp theo trường bought giảm dần
        .limit(10) // Giới hạn kết quả trả về chỉ 10 bản ghi
        .exec();
    }
    res.json({allProduct, ...object})
  } catch (e) {
    console.log(e)
    res.json({
      message: 'Lấy thông tin sản phẩm thất bại'
    })
  }
});

const getBestSalePercentProducts = asyncHandler(async (req, res) => {
  try {
    const biggestSale = await Product
      .find()
      .sort({ salePercent: -1 }) // Sắp xếp theo createdAt giảm dần
      .limit(20) // Giới hạn kết quả trả về chỉ 1 bản ghi
      .exec();
    res.json({biggestSale})
  } catch (e) {
    res.json({
      message: 'Lấy thông tin sản phẩm thất bại'
    })
  }
});




module.exports = { getAllProduct, getAllAuthors, getByTypes, getNewestProduct, getBestSaleProducts, getBestSalePercentProducts, getProductById };
