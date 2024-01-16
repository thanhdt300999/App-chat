const axios = require("axios");


const ghnRequester = axios.create({
  headers: {
    Token: process.env.TOKEN_GHN,
    "Content-Type": 'application/json'
  },
  baseURL: 'https://dev-online-gateway.ghn.vn'
})

module.exports = { ghnRequester }