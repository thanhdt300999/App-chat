const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const bcrypt = require("bcryptjs")
const { generateToken } = require("../config/helper")
const registerUser = asyncHandler(async (req, res) => {
    console.log(req.body)
    const { name, email, password, pic } = req.body
    if (!name || !email || !password) {
        res.status(400).json({
            message: "Fill all the field"
        })
    }

    const userExist = await User.findOne({ email: email })
    if (userExist) {
        res.status(400).json({
            message: "Email is exists"
        })
    }
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt)
    
    const user = await User.create({
        name, email, password: hashPassword, pic
    })
    if (user) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({
            message: "Loi"
        })
    }
})



const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({
            message: "Login failed"
        })
    }
})




module.exports = { registerUser, loginUser };