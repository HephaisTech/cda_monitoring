const express = require('express');
const { updateUser, getUsers, getUserid, deleteUser } = require('../controllers/userCtrl');

const Router = express.Router();


Router.post('/list', getUsers);
Router.post('/id', getUserid);
Router.post('/delete', deleteUser);
Router.post('/update', updateUser);

module.exports = Router;