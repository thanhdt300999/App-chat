const express = require("express");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoute");

const { notFound, errorHandler } = require("./middleware/errorMiddleware");
const path = require("path");
const cors = require('cors')
const corsOpts = {
  origin: '*',

  methods: [
    'GET',
    'POST',
  ],

  allowedHeaders: [
    'Content-Type',
  ],
};
dotenv.config();
connectDB();

const app = express();
app.use(cors(corsOpts))

app.use(express.json()); // to accept json data

app.use("/api/user", userRoutes);
app.use("/api/products", productRoutes);


// Error Handling middlewares
app.use(notFound);
app.use(errorHandler);
app.use(function(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Credentials', true);
  next();
});
const PORT = process.env.PORT;

const server = app.listen(
  PORT,
  console.log(`Server running on PORT ${PORT}...`.yellow.bold)
);

