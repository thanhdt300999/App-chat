const jwt = require("jsonwebtoken");
const USer = require("../models/UserModel");
const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");

const auth = asyncHandler(async (req, res, next) => {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
            req.user = await User.findById(decoded.id).select("-password");
            next()
        } catch (error) {
            console.log(error)
            return res.status(401).json({ message: "Token is not authorized" })
        }
    }
    if (!token) {
        return res.status(401).json({ message: "Not authorized" })
    }
}) 

module.exports = { auth }