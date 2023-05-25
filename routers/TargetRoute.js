const express = require('express');
const { screenshotTarget, htmlScanTarget, saveTarget, getTarget, screenshotAll, htmlScanAll, deleteTargetMany, getTargetId, updateTarget, deleteTarget } = require('../controllers/TargetCtrl');
const { adminVerify, userVerify, tokenVerify } = require('../controllers/tokenVerify');
const Router = express.Router();

// Router.post('/screenshot', tokenVerify, screenshotTarget);


Router.post('/id', tokenVerify, getTargetId);
Router.post('/list', tokenVerify, getTarget);
Router.post('/new', adminVerify, saveTarget);
Router.post('/edit', adminVerify, updateTarget);
Router.post('/destroy', adminVerify, deleteTarget);
Router.post('/deleteAll', adminVerify, deleteTargetMany);



Router.post('/screenshot', tokenVerify, screenshotAll);
Router.post('/onescreen', tokenVerify, screenshotTarget);

Router.post('/scan', tokenVerify, htmlScanTarget);
Router.post('/allscan', tokenVerify, htmlScanAll);



module.exports = Router;