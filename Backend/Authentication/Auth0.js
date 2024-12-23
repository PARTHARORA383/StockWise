require('dotenv').config();  // This should be at the very top of your file
const { auth } = require('express-openid-connect');
const express = require('express')
const {verifyToken} = require('../Middleware/Tokenverification')

const config = {
  authRequired: false,
  auth0Logout: true,
  secret: process.env.AUTH0_SECRET,
  baseURL: process.env.BACKEND_BASE_URL,
  clientID: process.env.CLIENT_ID,
  issuerBaseURL: process.env.AUTH0_ISSUER_BASE_URL,

};

module.exports = 
  config
