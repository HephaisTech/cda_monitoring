const express = require('express');
const { updateUser, getUsers, getUserid, deleteUser } = require('../controllers/userCtrl');
const { adminVerify } = require('../controllers/tokenVerify');

const Router = express.Router();

/**
 * @swagger
 * /users/list:
 *   post:
 *     description:   sysadmin   get users list
 *     responses:
 *       200:
 *         description: result true/ false  
 */
Router.post('/list', adminVerify, getUsers);
/**
 * @swagger
 * /users/id:
 *   post:
 *     description:   sysadmin get a users  
 *     responses:
 *       200:
 *         description: result true/ false  
 */
Router.post('/id', adminVerify, getUserid);
/**
 * @swagger
 * /users/delete:
 *   post:
 *     description:   sysadmin delete  a users  
 *     responses:
 *       200:
 *         description: result true/ false  
 */
Router.post('/delete', adminVerify, deleteUser);
/**
 * @swagger
 * /users/update:
 *   post:
 *     description:   sysadmin update  a users  
 *     responses:
 *       200:
 *         description: result true/ false  
 */
Router.post('/update', adminVerify, updateUser);
//

module.exports = Router;