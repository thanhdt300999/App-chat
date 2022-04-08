const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");
const { generateToken } = require("../config/helper")
const getAllUser = asyncHandler(async (req, res) => {
    const { search } = req.query;
    const query = search ? {
        $or: [
            { name: { $regex: search, $options: "i" } },
            { email: { $regex: search, $options: "i" } }
        ]
    } : {}

    const users = await User.find(query).select("-password");
    if (users) {
        res.status(200).json({
            users: {
                ...users,
                token: generateToken(users._id)
            }
        })
    } else {
        res.status(400).json({
            message: "Error"
        })
    }
});

module.exports = { getAllUser };
