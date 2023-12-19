const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {createProduct} = require("../controllers/productController");

const router = express.Router();

router.post("/create" , protect, createProduct);
// router.get("/:id" , getProductById);
// router.get("/" , getAllProduct);
// router.get("/newest" , getNewestProduct);
// router.get("/salest" , getSalestProduct);
// router.put("/:id" , protect, editProduct);
// router.delete("/:id" , protect, deleteProduct);


module.exports = router;
