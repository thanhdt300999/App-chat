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


const getAllChats = asyncHandler(async (req, res) => {
    try {
        const allChats = await Chat.find({ users: { $elemMatch: { $eq: req.user.id } } })
            .populate("users", "-password")
            .populate("latestMessenger")
            .populate("groupAdmin", "-password")
            .populate("latestMessenger.sender", "-password")
        res.status(200).json({
            data: allChats
        })
    } catch (error) {
        res.status(400).json({
            message: error
        })
    }
})
const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please Fill all the feilds" });
    }

    let users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res
            .status(400)
            .send("More than 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user,
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (error) {
        res.status(400);
        throw new Error(error.message);
    }
});

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(
        chatId,
        {
            chatName: chatName,
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat);
    }
});

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    // check if the requester is admin

    const removed = await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!removed) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(removed);
    }
});

const addToGroup = asyncHandler(async (req, res) => {
    const { chatId, userId } = req.body;

    const added = await Chat.findByIdAndUpdate(
        chatId,
        {
            $push: { users: userId },
        },
        {
            new: true,
        }
    )
        .populate("users", "-password")
        .populate("groupAdmin", "-password");

    if (!added) {
        res.status(404);
        throw new Error("Chat Not Found");
    } else {
        res.json(added);
    }
});


module.exports = { accessChat, getAllChats, createGroupChat, removeFromGroup, addToGroup, renameGroup }
