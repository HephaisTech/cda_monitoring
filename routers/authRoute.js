const express = require('express');
const { register, login, registerAdmin } = require('../controllers/authCtrl');
const { adminVerify, cookieCheck } = require('../controllers/tokenVerify');
const Router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     description: register new user (unique email && password) required
 *     responses:
 *       201:
 *         description: result true/ false
 */
Router.post('/register', register);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     description: authenticate a user  email required && password required
 *     responses:
 *       200:
 *         description: result true/ false and new header cookie  CDATOKEN
 */
Router.post('/login', login);
/**
 * @swagger
 * /auth/check:
 *   post:
 *     description: check cookie validity
 *     responses:
 *       200:
 *         description: result true/ false  
 */
Router.post('/check', cookieCheck);
/**
 * @swagger
 * /auth/sysadmin:
 *   post:
 *     description: check if current user is sysadmin  
 *     responses:
 *       200:
 *         description: result true/ false  
 */
Router.post('/sysadmin', adminVerify, registerAdmin);


module.exports = Router;