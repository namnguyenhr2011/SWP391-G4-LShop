const express = require('express');
const routes = express.Router();
const controller = require('../../controllers/admin/admin.controller');
const authorization = require('../../../middleware/user.middleware');



routes.get('/getAllUser', controller.getAllUser);
routes.post('/changeRole/:id', authorization.Authorization, controller.changeRoleById);
routes.put('/changeStatus/:id', authorization.Authorization, controller.changeStatus);


routes.put('/adminChangePass/:id', authorization.Authorization, controller.adminResetPassword)

module.exports = routes;