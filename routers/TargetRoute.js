const express = require('express');
const { screenshotTarget, htmlScanTarget, saveTarget, getTarget, screenshotAll, htmlScanAll, deleteTargetMany, getTargetId, updateTarget, deleteTarget, setSafeTarget } = require('../controllers/TargetCtrl');
const { adminVerify, userVerify, tokenVerify } = require('../controllers/tokenVerify');
const Router = express.Router();

// Router.post('/screenshot', tokenVerify, screenshotTarget);

/**
 * @swagger
 * /target/id:
 *   post:
 *     description: Get a Target
 *     parameters:
 *      - name: id
 *        description: id of the Targets
 *        in: formData
 *        required: true
 *        type: string
 *     responses:
 *       200:
 *         description: result true/false
 */
Router.post('/id', tokenVerify, getTargetId);
/**
 * @swagger
 * /target/list:
 *   post:
 *     description: Get list of Target
 *     parameters: 
 *     responses:
 *       200:
 *         description: result true/false
 */
Router.post('/list', tokenVerify, getTarget);
/**
 * @swagger
 * /target/new:
 *   post:
 *     description: create a Target with  name  and url in formData
 *     responses:
 *       200:
 *         description: result true/false
 */
Router.post('/new', adminVerify, saveTarget);
/**
 * @swagger
 * /target/edit:
 *   post:
 *     description: update Target ressource with new Target (id required) in formData
 *     responses:
 *       201:
 *         description: result true/ false
 */
Router.post('/edit', adminVerify, updateTarget);
/**
 * @swagger
 * /target/safe:
 *   post:
 *     description: update  Target ressource status to safe (id required) in formData
 *     responses:
 *       200:
 *         description: result true/ false
 */
Router.post('/safe', adminVerify, setSafeTarget);
/**
 * @swagger
 * /target/destroy:
 *   post:
 *     description: delete  Target ressource   (id required) in formData
 *     responses:
 *       200:
 *         description: result true/ false
 */
Router.post('/destroy', adminVerify, deleteTarget);

/**
 * @swagger
 * /target/deleteAll:
 *   post:
 *     description: delete all Target ressources  
 *     responses:
 *       200:
 *         description: result true/ false
 */

Router.post('/deleteAll', adminVerify, deleteTargetMany);

/**
 * @swagger
 * /target/screenshot:
 *   post:
 *     description: screenshot all Target and send images url
 *     responses:
 *       200:
 *         description: result true/ false
 */
Router.post('/screenshot', tokenVerify, screenshotAll);
/**
 * @swagger
 * /target/onescreen:
 *   post:
 *     description: take a Target screenshot and send image url (id required) in formData
 *     responses:
 *       200:
 *         description: result true/ false
 */
Router.post('/onescreen', tokenVerify, screenshotTarget);
/**
 * @swagger
 * /target/scan:
 *   post:
 *     description: scan a Target  and send result (id required) in formData
 *     responses:
 *       200:
 *         description: result true/ false
 */
Router.post('/scan', tokenVerify, htmlScanTarget);
/**
 * @swagger
 * /target/allscan:
 *   post:
 *     description: scan all Target and send result
 *     responses:
 *       200:
 *         description: result true/ false
 */
Router.post('/allscan', tokenVerify, htmlScanAll);



module.exports = Router;