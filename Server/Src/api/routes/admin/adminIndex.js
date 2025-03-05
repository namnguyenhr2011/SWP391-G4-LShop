const userRoute = require('./user.router')


module.exports = (app) => {
    const api = '/api'
    app.use(api + '/admin', userRoute);

}