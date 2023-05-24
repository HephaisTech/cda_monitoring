const express = require('express');
const { screenshotTarget, htmlScanTarget, saveTarget, getTarget } = require('../controllers/TargetCtrl');
const { adminVerify, userVerify, tokenVerify } = require('../controllers/tokenVerify');
const Router = express.Router();

// Router.post('/screenshot', tokenVerify, screenshotTarget);

Router.post('/scan', tokenVerify, htmlScanTarget);

Router.post('/list', tokenVerify, getTarget);

Router.post('/new', adminVerify, saveTarget);




module.exports = Router;