const { getAllUser } = require("../controller/userController");

const router = require("express").Router();

router.post("/", getAllUser);
module.exports = router;
