const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {loginAsAdmin, getAllUser, deleteProduct , getAllProducts, editProduct, getAllOrders, createProduct, editOrderStatus} = require("../controllers/adminController");
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
router.get("/get-users" , getAllUser);
router.post("/product-create" , upload.single('image'), createProduct);
router.get("/get-products" , getAllProducts);
router.put("/edit-product", upload.single('image') , editProduct);
router.delete("/product" , deleteProduct);
router.get("/get-orders" , getAllOrders);
router.put("/edit-order-status" , editOrderStatus);

// router.put("/update", protect , updateCart);
// router.get("/province", protect , getProvince);
// router.get("/district", protect , getDistrict);
// router.get("/ward", protect , getWard);
// router.get("/caculateShippingFree", protect , getShippingFee);

module.exports = router;
