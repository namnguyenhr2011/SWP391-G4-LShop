const express = require('express');
const routes = express.Router();
const controller = require('../../controllers/admin/ads.controller');
const authorization = require('../../../middleware/user.middleware');


routes.get('/getAllAds', controller.getAll);
// routes.get('/getAdsById/:id', controller.getById);
routes.post('/addAds', authorization.Authorization, controller.create);
routes.put('/updateAds/:adsId', authorization.Authorization, controller.update);
routes.delete('/deleteAds/:adsId', authorization.Authorization, controller.delete);
routes.put('/activeAds/:adsId', authorization.Authorization, controller.inactive);

module.exports = routes;