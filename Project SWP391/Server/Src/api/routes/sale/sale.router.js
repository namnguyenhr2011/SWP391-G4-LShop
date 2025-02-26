const express = require('express')
const routes = express.Router()
const authorization = require('../../../middleware/user.middleware')

const controller = require('../../controllers/Sale/sale.controller')



routes.get('/getAllProductsWithSale', controller.getAllProductsWithSale)
routes.post('/addSalePrice', authorization.Authorization, controller.addSalePrice)
routes.put('/updateSalePrice/:id', authorization.Authorization, controller.updateSalPrice)
// routes.delete('/deleteSale/:id', authorization.Authorization, controller.deleteSale)

module.exports = routes