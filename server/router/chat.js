const router = require("express").Router();
const { accessChat } = require("../controller/chatController");
const { auth } = require("../middlewares/authMiddleware")

router.post("/", auth, accessChat);



module.exports = router;
