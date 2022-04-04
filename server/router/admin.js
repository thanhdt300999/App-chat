const router = require("express").Router();

router.get("/", (req, res) => {
    res.send("Api is runnig")
})


module.exports = router;