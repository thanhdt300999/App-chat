const { getAllUser } = require("../controller/userController");

const router = require("express").Router();
const { auth } = require("../middlewares/authMiddleware")
router.post("/", auth, getAllUser);
module.exports = router;
