const asyncHandler = require("express-async-handler");
const User = require("../models/UserModel");

const getAllUser = asyncHandler( async (req, res) => {
  const { search } = req.query;
    const query = search ? {
        $or: [
            {name: {$regex: search, $option: "i"}},
            {email: {$regex: search, $option: "i"}}
        ]
    } : {}

    const users = await User.find(query).find({_id: {$ne: req.user._id}})
    if(user) {
        res.status(200).json({
            users: users
        })
    } else {
        res.status(400).json({
            message: "Error"
        })
    }
});

module.exports = { getAllUser };
