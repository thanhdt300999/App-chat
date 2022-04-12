const router = require("express").Router();
const { accessChat, getAllChats, createGroupChat, renameGroup, removeFromGroup, addToGroup } = require("../controller/chatController");
const { auth } = require("../middlewares/authMiddleware")

router.post("/", auth, accessChat);
router.get("/", auth, getAllChats)
router.post("/group-chat", auth, createGroupChat);
router.put("/group-chat/rename", auth, renameGroup);
router.put("/group-chat/remove", auth, removeFromGroup);
router.put("/group-chat/add", auth, addToGroup);


module.exports = router;
