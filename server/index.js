const express = require('express')
require("dotenv").config();
const http = require("http")
const app = express()
const server = http.createServer(app);
const { MongoClient } = require('mongodb');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middlewares/errorHandle');
const dashBoardRouter = require("./router/admin")
const authRouter = require("./router/auth")
//=======================================
// MongoClient.connect(process.env.DATABASE, (err, db) => {
//     if (err) {
//         console.log("Connection failed");
//     } else {
//         console.log("Connection success to MongoDb")
//     }
// })
connectDB(); 
//=======================================
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


app.use("/auth", authRouter)

app.use(notFound)
app.use(errorHandler)



server.listen(process.env.PORT, () => {
    console.log("server run in port " + process.env.PORT)
})