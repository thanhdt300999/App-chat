const express = require("express");
const { protect, protectAdmin} = require("../middleware/authMiddleware");
const {loginAsAdmin, getAllUser, deleteProduct , getAllProducts, editProduct, getAllOrders, createProduct, editOrderStatus } = require("../controllers/adminController");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    },
});
const upload = multer({ storage: storage });

const router = express.Router();

router.post('/login' , loginAsAdmin);
router.get("/get-users", protectAdmin , getAllUser);
router.post("/product-create",protectAdmin , upload.single('image'), createProduct);
router.get("/get-products" , getAllProducts);
router.put("/edit-product",protectAdmin, upload.single('image') , editProduct);
router.delete("/product",protectAdmin , deleteProduct);
router.get("/get-orders", protectAdmin , getAllOrders);
router.put("/change-status", protectAdmin , editOrderStatus);

module.exports = router;
