const express = require('express');
const { register, login, registerAdmin } = require('../controllers/authCtrl');
const { adminVerify, cookieCheck } = require('../controllers/tokenVerify');
const Router = express.Router();


Router.post('/register', register);
Router.post('/login', login);

Router.post('/check', cookieCheck);

Router.post('/sysadmin', adminVerify, registerAdmin);


module.exports = Router;