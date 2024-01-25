const jwt = require("jsonwebtoken");
const User = require("../models/userModel.js");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      res.locals.decodeToken = decoded
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(403);
      throw new Error("Not authorized, token failed");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

const protectAdmin = asyncHandler(async (req, res, next) => {
  let token;
  if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];
      //decodes token id
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded?.isAdmin) {
        res.status(403);
        throw new Error("Xác thực thất bại!");
      }
      res.locals.decodeToken = decoded
      req.user = await User.findById(decoded.id).select("-password");

      next();
    } catch (error) {
      res.status(403);
      throw new Error("Xác thực thất bại!");
    }
  }

  if (!token) {
    res.status(401);
    throw new Error("Not authorized, no token");
  }
});

module.exports = { protect, protectAdmin };
