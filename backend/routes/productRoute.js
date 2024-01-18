const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {createProduct, getAllProduct} = require("../controllers/productController");
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

// router.get("/:id" , getProductById);
router.get("/" , getAllProduct);
// router.get("/newest" , getNewestProduct);
// router.get("/salest" , getSalestProduct);
// router.put("/:id" , protect, editProduct);
// router.delete("/:id" , protect, deleteProduct);

module.exports = {upload};

module.exports = router;
