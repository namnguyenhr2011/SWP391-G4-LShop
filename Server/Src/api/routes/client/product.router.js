const express = require('express')
const routes = express.Router()
const authorization = require('../../../middleware/user.middleware')

const controller = require('../../controllers/client/product.controller')


routes.get('/getAllProduct', controller.getAllProducts)
routes.get('/getProductBySubCategory/:subcategoryId', controller.getProductBySubCategory)

routes.get('/getProductById/:id', controller.getProductById)
//Get top 8 product with most rating
routes.get('/getTop8', controller.getTop8)

//Get top 8 prroduct with most sold
routes.get('/getTopSold', controller.getTopSold)

//Get top 8 prroduct with most view
routes.get('/getTopView', controller.getTopView)

routes.post('/addProduct/:subcategoryId', authorization.Authorization, controller.addProduct)


routes.put('/updateProduct/:id', authorization.Authorization, controller.updateProduct)
routes.delete('/managerDelete/:id', authorization.Authorization, controller.managerDeleteProduct)
routes.delete('/adminDelete/:id', authorization.Authorization, controller.adminDeleteProduct)


routes.post('/search', controller.searchProducts)
routes.get('/getProductByCategory/:category', controller.getProductByCategory)

module.exports = routes;