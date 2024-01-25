const jwt = require("jsonwebtoken");

const generateToken = (id) => {
  return jwt.sign({ id, isAdmin: false }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};
const generateTokenAdmin = (id) => {
  return jwt.sign({ id, isAdmin: true }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });
};

module.exports = {generateToken, generateTokenAdmin};
