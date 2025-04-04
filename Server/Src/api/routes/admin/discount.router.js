const express = require('express');
const routes = express.Router();
const controller = require('../../controllers/admin/discount.controller');
const authorization = require('../../../middleware/user.middleware');

routes.get('/getAllDiscount', controller.getAllDiscount);
routes.post('/createDiscount', authorization.Authorization, controller.createDiscount);
routes.put('/updateDiscount/:id', authorization.Authorization, controller.updateDiscount);
routes.delete('/deleteDiscount/:id', authorization.Authorization, controller.deleteDiscount);
routes.put('/activeDiscount/:id', authorization.Authorization, controller.activeDiscount);
routes.post('/assignDiscount', authorization.Authorization, controller.assignDiscount);
routes.put('/unassignDiscount', authorization.Authorization, controller.unassignDiscount);



module.exports = routes;