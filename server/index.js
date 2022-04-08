const express = require('express')
require("dotenv").config();
const http = require("http")
const app = express()
const server = http.createServer(app);
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandle');
const authRoutes = require("./router/auth")
const userRoutes = require("./router/user")
const adminRoutes = require("./router/admin")
const chatRoutes = require("./router/chat")

//=======================================
//connect dB

connectDB(); 


//=======================================
//connect socket
const socketIo = require("socket.io")(server, {
    cors: {
        origin: '*'
    }
})
socketIo.on("connection", (socket) => {
    console.log("socket connected ", + socket.id)
    socket.on("sendDataClient", function (data) { // Handle khi có sự kiện tên là sendDataClient từ phía client
        socketIo.emit("sendDataServer", { data });// phát sự kiện  có tên sendDataServer cùng với dữ liệu tin nhắn từ phía server
    })

    socket.on("disconnect", () => {
        console.log("Client disconnected"); // Khi client disconnect thì log ra terminal.
    });
})

//=======================================
app.use(express.json())


//router
app.use("/", adminRoutes)
app.use("/auth", authRoutes)
app.use("/users", userRoutes)
app.use("/chat", chatRoutes)


//=======================================
//error handle
app.use(notFound)
app.use(errorHandler)



server.listen(process.env.PORT, () => {
    console.log("server run in port " + process.env.PORT)
})