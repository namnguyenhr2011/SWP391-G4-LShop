const express = require('express')
const routes = express.Router()
const authorization = require('../../../middleware/user.middleware')

const controller = require('../../controllers/Sale/sale.controller')



routes.get('/getAllProductsWithSale', controller.getAllProductsWithSale)
// routes.post('/addSale', authorization.Authorization, controller.addSale)
// routes.put('/updateSale/:id', authorization.Authorization, controller.updateSale)
// routes.delete('/deleteSale/:id', authorization.Authorization, controller.deleteSale)

module.exports = routes