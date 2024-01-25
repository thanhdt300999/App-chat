const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {getAllAuthors, getAllProduct, getByTypes, getNewestProduct, getBestSaleProducts, getBestSalePercentProducts, getProductById} = require("../controllers/productController");
const multer = require('multer');
const path = require('path');

const router = express.Router();
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

router.get("/detail/:id" , getProductById);
router.get("/" , getAllProduct);
router.get("/authors" , getAllAuthors);
router.get("/get-by-type" , getByTypes);
router.get("/newest" , getNewestProduct);
router.get("/best-sale" , getBestSaleProducts);
router.get("/best-sale-percent" , getBestSalePercentProducts);

module.exports = {upload};

module.exports = router;
