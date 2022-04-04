const jwt = require("jsonwebtoken")

function generateToken(id) {
    return jwt.sign({ id }, process.env.SECRET_KEY, {
        expiresIn: "30d"
    })
}
module.exports = { generateToken }