const express = require('express')
const routes = express.Router()
const controller = require('../../controllers/client/user.controller')
const validate = require('../../../validate/user.validate')
const authorization = require('../../../middleware/user.middleware')

routes.post('/login', validate.loginValidate, controller.login)

routes.post('/register', controller.register)
routes.post('/verify', controller.vertifyEmail)

routes.get('/getUserID/:email', controller.getUserID)


routes.post('/forgotPassword', controller.forgot)
routes.post('/otp', controller.otp)
routes.post('/resetPassword', validate.resetPasswordValidate, controller.reset)


routes.get('/user-profile', authorization.Authorization, controller.profile)
routes.patch('/edit-profile', authorization.Authorization, controller.editProfile)




module.exports = routes;