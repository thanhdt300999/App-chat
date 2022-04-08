const asyncHandler = require("express-async-handler");
const { default: mongoose } = require("mongoose");
const Chat = require("../models/ChatModel");
const User = require("../models/UserModel");
const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        res.status(400).json({
            message: "User id is undefined"
        })
    }

    let isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user.id } } },
            { users: { $elemMatch: { $eq: userId } } }
        ]
    })
        .populate("users", "-password")
        .populate("latestMessage")
    isChat = await User.populate(isChat, {
        path: "latestMessage.sender",
        select: "name email pic"
    })

    if (isChat.length > 0) {
        return res.send({
            data: isChat[0]
        })
    } else {
        let chatData = {
            chatName: "sender",
            isGroupChat: "false",
            users: [
                mongoose.Types.ObjectId(req.user.id), mongoose.Types.ObjectId(userId)
            ]
        }
        console.log(chatData)
        try {
            const createChat = await Chat.create(chatData);
            const fullChat = await Chat.findOne({ _id: createChat._id }).populate("users", "-password");
            return res.status(200).json({
                data: fullChat
            })
        } catch (error) {
            return res.status(400).json({
                message: "Error when create chat box",
                error: error
            })
        }
    }
})


module.exports = { accessChat }