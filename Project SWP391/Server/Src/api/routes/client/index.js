const userRoute = require('./user.router')
const productRoute = require('./product.router')
const categoryRoute = require('./category.router')


module.exports = (app) => {
    const api = '/api'
    app.use(api + '/user', userRoute);
    app.use(api + '/product', productRoute);
    app.use(api + '/category', categoryRoute);

}